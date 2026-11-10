interface SettingsStore {
  get<T>(key: string): Promise<T | undefined>;
}

interface WritableSettingsStore {
  set(key: string, value: string): Promise<void>;
  save(): Promise<void>;
}

export async function saveSettings(
  store: WritableSettingsStore,
  settings: { apiKey: string; apiUrl: string; model: string },
  writeApiKey: (apiKey: string) => Promise<void>,
) {
  await writeApiKey(settings.apiKey);
  await store.set("apiUrl", settings.apiUrl);
  await store.set("model", settings.model);
  await store.save();
}

// Await all persisted values before translation; a missing value uses its default.
export async function readSettings(store: SettingsStore, readApiKey: () => Promise<string>) {
  // The backend migrates any legacy key before returning the credential.
  const apiKey = await readApiKey();
  const keys = ["apiUrl", "model"] as const;
  const values = await Promise.all(keys.map(async (key) => {
    const value = await store.get<unknown>(key);
    if (value == null) return "";
    if (typeof value !== "string") throw new Error(`配置项 ${key} 必须是文本`);
    return value.trim();
  }));
  return { apiKey, apiUrl: values[0], model: values[1] };
}
