import { useState } from "react";
import TranslateView from "./components/TranslateView";
import SettingsView from "./components/SettingsView";

type View = "translate" | "settings";

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LogoIcon = () => (
  <div style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)", borderRadius: "6px", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState<View>("translate");

  return (
    <div className="h-full flex flex-col card-surface rounded-2xl overflow-hidden grid-bg" style={{ boxShadow: "0 0 0 1px rgba(0,212,255,0.1), 0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.05)" }}>
      <div
        data-tauri-drag-region
        className="flex items-center justify-between px-4 py-3 header-border"
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center gap-2.5" data-tauri-drag-region>
          <LogoIcon />
          <span className="text-xs font-bold tracking-widest gradient-text uppercase">
            QuickTranslate
          </span>
        </div>

        <button
          onClick={() => setCurrentView(currentView === "translate" ? "settings" : "translate")}
          className="p-1.5 rounded-lg settings-icon-btn"
        >
          {currentView === "translate" ? <IconSettings /> : <IconBack />}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {currentView === "translate" ? <TranslateView /> : <SettingsView />}
      </div>
    </div>
  );
}

export default App;
