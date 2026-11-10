interface SettingsStore {
  get<T>(key: string): Promise<T | undefined>;
}

// Await all persisted values before translation; a missing value uses its default.
export async function readSettings(store: SettingsStore) {
  const keys = ["apiKey", "apiUrl", "model"] as const;
  const values = await Promise.all(keys.map(async (key) => {
    const value = await store.get<unknown>(key);
    if (value == null) return "";
    if (typeof value !== "string") throw new Error(`配置项 ${key} 必须是文本`);
    return value.trim();
  }));
  return { apiKey: values[0], apiUrl: values[1], model: values[2] };
}
