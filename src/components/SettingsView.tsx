import { useState, useEffect } from "react";
import { load } from "@tauri-apps/plugin-store";

function SettingsView() {
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [model, setModel] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const store = await load("settings.json");
      setApiKey((await store.get<string>("apiKey")) ?? "");
      setApiUrl((await store.get<string>("apiUrl")) ?? "");
      setModel((await store.get<string>("model")) ?? "");
    })();
  }, []);

  const handleSave = async () => {
    const store = await load("settings.json");
    await store.set("apiKey", apiKey);
    await store.set("apiUrl", apiUrl);
    await store.set("model", model);
    await store.save();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
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
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="qwen-turbo"
            className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={handleSave}
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
