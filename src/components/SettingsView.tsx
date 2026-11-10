import { useState, useEffect } from "react";
import { load } from "@tauri-apps/plugin-store";
import { readSettings } from "../settings";

function SettingsView() {
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [model, setModel] = useState("");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const settings = await readSettings(await load("settings.json"));
        if (!active) return;
        setApiKey(settings.apiKey);
        setApiUrl(settings.apiUrl);
        setModel(settings.model);
        setReady(true);
      } catch {
        if (active) setError("读取配置失败，请重新打开设置后重试");
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSave = async () => {
    if (!ready || saving) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const store = await load("settings.json");
      await store.set("apiKey", apiKey);
      await store.set("apiUrl", apiUrl);
      await store.set("model", model);
      await store.save();
      setSaved(true);
    } catch {
      setError("保存配置失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <div style={{ marginBottom: "4px" }}>
        <p className="gradient-text" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          接口配置
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div>
          <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px", letterSpacing: "0.05em" }}>
            API KEY
          </label>
          <input
            disabled={!ready}
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-... （通义千问 API Key）"
            className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px", letterSpacing: "0.05em" }}>
            API URL
            <span style={{ marginLeft: "6px", color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>（可选）</span>
          </label>
          <input
            disabled={!ready}
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1"
            className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px", letterSpacing: "0.05em" }}>
            MODEL
          </label>
          <input
            disabled={!ready}
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="qwen-turbo"
            className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
        <button
          onClick={handleSave}
          disabled={!ready || saving}
          className="btn-glow w-full py-2.5 rounded-xl text-sm font-semibold text-white tracking-wide"
        >
          {saved ? "✓ 已保存" : "保存配置"}
        </button>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", textAlign: "center", letterSpacing: "0.05em" }}>
          ⌘ + Shift + T　呼出 / 隐藏
        </p>
      </div>
    </div>
  );
}

export default SettingsView;
