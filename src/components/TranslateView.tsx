import { useState, useCallback, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";

interface Settings {
  apiKey: string;
  apiUrl: string;
  model: string;
}

function TranslateView() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<Settings>({ apiKey: "", apiUrl: "", model: "" });

  useEffect(() => {
    inputRef.current?.focus();
    // Load settings once on mount and cache in ref to avoid repeated disk I/O
    (async () => {
      try {
        const store = await load("settings.json");
        settingsRef.current = {
          apiKey: ((await store.get<string>("apiKey")) ?? "").trim(),
          apiUrl: ((await store.get<string>("apiUrl")) ?? "").trim(),
          model: ((await store.get<string>("model")) ?? "").trim(),
        };
      } catch {
        // Settings not yet saved; defaults remain empty strings
      }
    })();
  }, []);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const { apiKey, apiUrl, model } = settingsRef.current;

      const translated = await invoke<string>("translate", {
        text: inputText,
        apiKey,
        apiUrl,
        model,
      });
      setResult(translated);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [inputText, loading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleTranslate();
      }
    },
    [handleTranslate],
  );

  const handleCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-3">
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入文本，自动检测语言互译..."
          className="input-dark w-full h-full resize-none rounded-xl p-3 text-sm leading-relaxed"
        />
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className={`btn-glow w-full py-2.5 rounded-xl text-sm font-semibold text-white tracking-wide ${loading ? "btn-glow-loading" : ""}`}
        >
          {loading ? "AI 翻译中..." : "翻 译　⌘ ↵"}
        </button>
      </div>

      <div className="divider-glow mx-3" />

      <div className="flex-1 p-3 relative">
        {error ? (
          <div className="h-full flex items-start pt-1">
            <div className="flex items-start gap-2">
              <span style={{ color: "#ff6b6b", fontSize: "11px", lineHeight: 1.6 }}>⚠ {error}</span>
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            <textarea
              value={result}
              readOnly
              placeholder="翻译结果将在此显示..."
              className={`input-dark w-full h-full resize-none rounded-xl p-3 text-sm leading-relaxed ${result ? "result-appear" : ""}`}
            />
            {result && (
              <button
                onClick={handleCopy}
                className="copy-btn absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium"
              >
                {copied ? "✓ 已复制" : "复制"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-2.5 flex items-center justify-center">
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.05em" }}>
          Powered by LLM
        </span>
      </div>
    </div>
  );
}

export default TranslateView;
