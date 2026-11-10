use serde_json::Value;
use std::sync::Mutex;
use tauri_plugin_store::StoreExt;

const KEYCHAIN_ERROR: &str = "系统钥匙串不可用，请解锁后重试";
// Serialize migration, updates and deletion across both views and blocking workers.
static KEY_LOCK: Mutex<()> = Mutex::new(());

trait Vault {
    fn get(&self) -> Result<Option<String>, String>;
    fn set(&self, value: &str) -> Result<(), String>;
    fn delete(&self) -> Result<(), String>;
}

impl Vault for keyring::Entry {
    fn get(&self) -> Result<Option<String>, String> {
        match self.get_password() {
            Ok(value) => Ok(Some(value)),
            Err(keyring::Error::NoEntry) => Ok(None),
            Err(_) => Err(KEYCHAIN_ERROR.into()),
        }
    }

    fn set(&self, value: &str) -> Result<(), String> {
        self.set_password(value).map_err(|_| KEYCHAIN_ERROR.into())
    }

    fn delete(&self) -> Result<(), String> {
        match self.delete_credential() {
            Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
            Err(_) => Err(KEYCHAIN_ERROR.into()),
        }
    }
}

fn save_key(vault: &impl Vault, key: &str) -> Result<(), String> {
    let key = key.trim();
    if key.is_empty() {
        return vault.delete();
    }
    vault.set(key)?;
    if vault.get()?.as_deref() != Some(key) {
        return Err(KEYCHAIN_ERROR.into());
    }
    Ok(())
}

fn migrate_key(
    vault: &impl Vault,
    legacy: Option<Value>,
    remove_legacy: impl FnOnce() -> Result<(), String>,
) -> Result<String, String> {
    let existing = vault.get()?;
    let Some(legacy) = legacy else {
        return Ok(existing.unwrap_or_default());
    };
    let key = match existing {
        // An already secured key wins over stale plaintext, including after a retry.
        Some(key) => key,
        None => {
            let key = match &legacy {
                Value::Null => "",
                Value::String(key) => key.trim(),
                _ => return Err("配置项 apiKey 必须是文本".into()),
            };
            save_key(vault, key)?;
            key.to_string()
        }
    };
    // Never delete plaintext before a successful keychain write and read-back.
    remove_legacy()?;
    Ok(key)
}

async fn access_key(app: tauri::AppHandle, update: Option<String>) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let _guard = KEY_LOCK.lock().map_err(|_| KEYCHAIN_ERROR.to_string())?;
        let vault = keyring::Entry::new("com.tonysheng.quicktranslate", "apiKey")
            .map_err(|_| KEYCHAIN_ERROR.to_string())?;
        let store = app
            .store_builder("settings.json")
            .disable_auto_save()
            .build()
            .map_err(|_| "读取配置失败".to_string())?;
        let legacy = store.get("apiKey");
        let key = migrate_key(&vault, legacy.clone(), || {
            store.delete("apiKey");
            if store.save().is_err() {
                // Keep the legacy value available in memory for a retry.
                if let Some(value) = legacy {
                    store.set("apiKey", value);
                }
                return Err("清除旧版 API Key 失败，请重试".into());
            }
            Ok(())
        })?;
        if let Some(update) = update {
            save_key(&vault, &update)?;
            Ok(String::new())
        } else {
            Ok(key)
        }
    })
    .await
    .map_err(|_| KEYCHAIN_ERROR.to_string())?
}

#[tauri::command]
pub async fn get_api_key(app: tauri::AppHandle) -> Result<String, String> {
    access_key(app, None).await
}

#[tauri::command]
pub async fn set_api_key(app: tauri::AppHandle, api_key: String) -> Result<(), String> {
    access_key(app, Some(api_key)).await.map(|_| ())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::{Cell, RefCell};

    #[derive(Default)]
    struct FakeVault {
        value: RefCell<Option<String>>,
        fail_read: Cell<bool>,
        fail_write: Cell<bool>,
        fail_readback: Cell<bool>,
    }

    impl Vault for FakeVault {
        fn get(&self) -> Result<Option<String>, String> {
            if self.fail_read.get() {
                return Err(KEYCHAIN_ERROR.into());
            }
            Ok(self.value.borrow().clone())
        }
        fn set(&self, value: &str) -> Result<(), String> {
            if self.fail_write.get() {
                return Err(KEYCHAIN_ERROR.into());
            }
            *self.value.borrow_mut() = Some(value.into());
            self.fail_read.set(self.fail_readback.get());
            Ok(())
        }
        fn delete(&self) -> Result<(), String> {
            if self.fail_write.get() {
                return Err(KEYCHAIN_ERROR.into());
            }
            *self.value.borrow_mut() = None;
            Ok(())
        }
    }

    #[test]
    fn keyring_adapter_handles_missing_entries_and_redacts_backend_errors() {
        // Exercise our actual keyring adapter without accessing the user's OS keychain.
        let vault =
            keyring::Entry::new_with_credential(Box::new(keyring::mock::MockCredential::default()));
        assert_eq!(vault.get().unwrap(), None);
        vault.delete().unwrap();
        save_key(&vault, "test-key").unwrap();
        assert_eq!(vault.get().unwrap().as_deref(), Some("test-key"));
        let mock = vault
            .get_credential()
            .downcast_ref::<keyring::mock::MockCredential>()
            .unwrap();
        mock.set_error(keyring::Error::BadEncoding(b"private".to_vec()));
        assert_eq!(vault.get().unwrap_err(), KEYCHAIN_ERROR);
        mock.set_error(keyring::Error::Invalid("private".into(), "private".into()));
        assert_eq!(vault.set("replacement").unwrap_err(), KEYCHAIN_ERROR);
        mock.set_error(keyring::Error::Invalid("private".into(), "private".into()));
        assert_eq!(vault.delete().unwrap_err(), KEYCHAIN_ERROR);
        save_key(&vault, "").unwrap();
        assert_eq!(vault.get().unwrap(), None);
    }

    #[test]
    fn migrates_and_verifies_before_removing_plaintext() {
        let vault = FakeVault::default();
        let removed = Cell::new(false);
        let key = migrate_key(&vault, Some(Value::from(" test-key ")), || {
            assert_eq!(vault.get()?.as_deref(), Some("test-key"));
            removed.set(true);
            Ok(())
        })
        .unwrap();
        assert_eq!(key, "test-key");
        assert!(removed.get());
        assert_eq!(
            migrate_key(&vault, None, || panic!("no legacy key")),
            Ok(key)
        );
    }

    #[test]
    fn read_write_and_readback_failures_preserve_legacy() {
        for failure in 0..3 {
            let vault = FakeVault::default();
            vault.fail_read.set(failure == 0);
            vault.fail_write.set(failure == 1);
            vault.fail_readback.set(failure == 2);
            let error = migrate_key(&vault, Some(Value::from("private")), || {
                panic!("must retain plaintext on keychain failure")
            })
            .unwrap_err();
            assert_eq!(error, KEYCHAIN_ERROR);
            assert!(!error.contains("private"));
        }
    }

    #[test]
    fn cleanup_failure_is_retryable_and_never_overwrites_a_secured_key() {
        let vault = FakeVault::default();
        assert!(migrate_key(&vault, Some(Value::from("old-key")), || Err(
            "disk failure".into()
        ))
        .is_err());
        save_key(&vault, "new-key").unwrap();
        assert_eq!(
            migrate_key(&vault, Some(Value::from("old-key")), || Ok(())),
            Ok("new-key".into())
        );
    }

    #[test]
    fn handles_missing_empty_null_and_corrupt_legacy_values() {
        let vault = FakeVault::default();
        assert_eq!(
            migrate_key(&vault, None, || panic!("no legacy key")),
            Ok("".into())
        );
        for value in [Value::Null, Value::from("  ")] {
            assert_eq!(migrate_key(&vault, Some(value), || Ok(())), Ok("".into()));
            assert_eq!(vault.get().unwrap(), None);
        }
        let error = migrate_key(&vault, Some(serde_json::json!({"private": 123})), || {
            panic!("must retain corrupt legacy value")
        })
        .unwrap_err();
        assert!(!error.contains("private"));
    }

    #[test]
    fn updates_and_clears_keys_without_plaintext_fallback() {
        let vault = FakeVault::default();
        save_key(&vault, " new-key ").unwrap();
        assert_eq!(vault.get().unwrap().as_deref(), Some("new-key"));
        vault.fail_write.set(true);
        assert!(save_key(&vault, "replacement").is_err());
        assert!(save_key(&vault, "").is_err());
        assert_eq!(vault.get().unwrap().as_deref(), Some("new-key"));
        vault.fail_write.set(false);
        save_key(&vault, " ").unwrap();
        save_key(&vault, "").unwrap();
        assert_eq!(vault.get().unwrap(), None);
    }
}
