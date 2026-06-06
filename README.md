# QuickTranslate 🌐

**English | [中文](#中文)**

[![Last commit](https://img.shields.io/github/last-commit/shengdabai/QuickTranslate)](https://github.com/shengdabai/QuickTranslate/commits)
[![Stars](https://img.shields.io/github/stars/shengdabai/QuickTranslate?style=social)](https://github.com/shengdabai/QuickTranslate/stargazers)
[![Follow @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

> A blazing-fast, always-on-top desktop translator that turns any OpenAI-compatible LLM into a one-keystroke Chinese ⇄ English assistant.

## Why QuickTranslate?

Browser tabs and bulky apps slow you down when you just need a quick translation. QuickTranslate lives in your system tray, pops up with a single global shortcut (`⌘/Ctrl + Shift + T`), auto-detects whether you typed Chinese or English, and hands the text to the LLM of your choice. No subscriptions, no telemetry — bring your own API key and you own the whole pipeline. Built with **Tauri**, so the whole thing is a tiny native binary, not a 200 MB Electron download.

## What It Is

A minimal, frameless desktop app (≈420×520, transparent, always-on-top) that calls any **OpenAI-compatible chat completions** endpoint to translate text. It ships pre-configured for **Alibaba Qwen / 通义千问 (DashScope)** but works with any compatible provider — just point it at your own API URL and model.

## ✨ Features

- **One-keystroke access** — Global shortcut `⌘/Ctrl + Shift + T` shows/hides the window from anywhere.
- **Auto-direction translation** — Detects Chinese vs. English input and translates to the other; mixed text follows the dominant language.
- **Bring-your-own LLM** — Any OpenAI-compatible API (Qwen/DashScope by default; set a custom API URL + model for others).
- **System tray integration** — Show/hide and quit straight from the tray icon and menu.
- **Persistent settings** — API key, endpoint, and model are saved locally via Tauri's store plugin.
- **Tiny native binary** — Tauri 2 + Rust backend instead of a heavyweight Electron shell.
- **Cross-platform** — Builds for macOS, Windows, and Linux from one codebase.
- **Modern dark UI** — Clean glassy interface built with React 19 and Tailwind CSS v4.

## 🧱 Tech Stack

- **Desktop framework:** Tauri 2 (Rust backend)
- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build tool:** Vite
- **Package manager:** pnpm
- **Networking:** `reqwest` (Rust) → OpenAI-compatible chat API

## 🚀 Build & Run

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) 1.70+ (with Cargo)
- [pnpm](https://pnpm.io/installation)
- Platform deps for Tauri — see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

### Steps

```bash
# 1. Clone
git clone https://github.com/shengdabai/QuickTranslate.git
cd QuickTranslate

# 2. Install JS dependencies
pnpm install

# 3. Run in dev mode (compiles the Rust backend on first run)
pnpm tauri dev

# 4. Build a production binary for your platform
pnpm tauri build
```

Build output:

- **macOS:** `src-tauri/target/release/bundle/`
- **Windows / Linux:** `src-tauri/target/release/`

## 📖 Usage

1. Launch the app — it starts hidden in the system tray.
2. Press `⌘/Ctrl + Shift + T` to summon the window (or click the tray icon).
3. Open **Settings** (gear icon) and enter your **API Key**. Optionally set a custom **API URL** and **Model** (defaults: DashScope endpoint + `qwen-turbo`). Click **保存配置 / Save**.
4. Type or paste text and translate — Chinese becomes English and vice versa.
5. Press the shortcut again to hide, or quit from the tray menu.

> Your API key is stored locally on your machine and is only sent to the endpoint you configure.

## 🗺️ Status

Early but functional (`v0.1.0`). Core translation, global shortcut, tray, and settings persistence all work. Pre-built release binaries aren't published yet — build from source for now. Roadmap ideas: streaming output, clipboard/selection capture, more language pairs, and packaged releases. Contributions and ideas welcome.

## 🤝 Connect & About

Built by **Tony (Sheng)** — a Chinese-language teacher (6000+ students) building AI + Chinese-teaching tools in public.

If QuickTranslate is useful to you, please **⭐ Star this repo** and **[Follow @shengdabai](https://github.com/shengdabai)** — it genuinely helps and keeps the tools coming.

Sibling projects you might like:

- [VoiceReaderApp](https://github.com/shengdabai/VoiceReaderApp)
- [LinguaLens](https://github.com/shengdabai/LinguaLens)
- [chinese-learning-app](https://github.com/shengdabai/chinese-learning-app)

## License

Released under the MIT License. (A `LICENSE` file will be added to the repo.)

---

<a name="中文"></a>

# QuickTranslate 🌐

**[English](#quicktranslate-) | 中文**

[![最近提交](https://img.shields.io/github/last-commit/shengdabai/QuickTranslate)](https://github.com/shengdabai/QuickTranslate/commits)
[![Star 数](https://img.shields.io/github/stars/shengdabai/QuickTranslate?style=social)](https://github.com/shengdabai/QuickTranslate/stargazers)
[![关注 @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

> 一款极速、置顶的桌面翻译工具——把任意 OpenAI 兼容的大模型变成一个快捷键即用的中英互译助手。

## 为什么用 QuickTranslate？

只想快速翻一句话时，开浏览器标签或庞大的应用都太慢。QuickTranslate 常驻系统托盘，按一个全局快捷键（`⌘/Ctrl + Shift + T`）即刻弹出，自动判断你输入的是中文还是英文，再把文本交给你选定的大模型处理。无订阅、无遥测——自带 API Key，整条链路完全归你掌控。基于 **Tauri** 构建，成品是一个轻量原生程序，而不是动辄 200 MB 的 Electron 安装包。

## 这是什么

一款极简、无边框的桌面应用（约 420×520，透明、置顶），调用任意 **OpenAI 兼容的 chat completions** 接口完成翻译。默认预配置 **阿里通义千问 / Qwen（DashScope）**，但兼容任何同协议的服务商——只需填入你自己的 API URL 和模型即可。

## ✨ 功能特性

- **一键呼出** — 全局快捷键 `⌘/Ctrl + Shift + T`，随时显示/隐藏窗口。
- **自动方向翻译** — 自动识别中文/英文输入并翻译成另一种语言；中英混排按主要语言判断。
- **自带大模型** — 兼容任意 OpenAI 协议接口（默认 Qwen/DashScope，可自定义 API URL 与模型对接其他服务商）。
- **系统托盘集成** — 通过托盘图标和菜单直接显示/隐藏、退出。
- **设置持久化** — API Key、接口地址、模型本地保存（基于 Tauri store 插件）。
- **轻量原生程序** — Tauri 2 + Rust 后端，告别臃肿的 Electron 外壳。
- **跨平台** — 一套代码即可构建 macOS、Windows、Linux 版本。
- **现代深色 UI** — 基于 React 19 与 Tailwind CSS v4 的简洁玻璃质感界面。

## 🧱 技术栈

- **桌面框架：** Tauri 2（Rust 后端）
- **前端：** React 19 + TypeScript
- **样式：** Tailwind CSS v4
- **构建工具：** Vite
- **包管理器：** pnpm
- **网络请求：** `reqwest`（Rust）→ OpenAI 兼容 chat 接口

## 🚀 构建与运行

### 前置要求

- [Node.js](https://nodejs.org/) 18 及以上
- [Rust](https://www.rust-lang.org/tools/install) 1.70 及以上（含 Cargo）
- [pnpm](https://pnpm.io/installation)
- Tauri 平台依赖 — 见 [Tauri 前置要求](https://v2.tauri.app/start/prerequisites/)

### 步骤

```bash
# 1. 克隆
git clone https://github.com/shengdabai/QuickTranslate.git
cd QuickTranslate

# 2. 安装前端依赖
pnpm install

# 3. 开发模式运行（首次会编译 Rust 后端）
pnpm tauri dev

# 4. 为当前平台构建生产版本
pnpm tauri build
```

构建产物位置：

- **macOS：** `src-tauri/target/release/bundle/`
- **Windows / Linux：** `src-tauri/target/release/`

## 📖 使用方法

1. 启动应用——默认隐藏在系统托盘中。
2. 按 `⌘/Ctrl + Shift + T` 呼出窗口（或点击托盘图标）。
3. 打开**设置**（齿轮图标）填入 **API Key**，可选填自定义 **API URL** 与 **模型**（默认 DashScope 接口 + `qwen-turbo`），点击**保存配置**。
4. 输入或粘贴文本进行翻译——中文译为英文，反之亦然。
5. 再次按快捷键即可隐藏，或从托盘菜单退出。

> 你的 API Key 仅保存在本机，且只会发送到你配置的接口地址。

## 🗺️ 项目状态

早期可用版本（`v0.1.0`）。核心翻译、全局快捷键、托盘、设置持久化均已可用。暂未发布预构建安装包，目前请从源码构建。后续规划：流式输出、剪贴板/划词取词、更多语言对、打包发布。欢迎贡献与建议。

## 🤝 联系与关于

由 **Tony（盛）** 开发——一名中文老师（6000+ 学员），公开构建 AI + 中文教学工具。

如果 QuickTranslate 对你有帮助，欢迎 **⭐ Star 本仓库** 并 **[关注 @shengdabai](https://github.com/shengdabai)**——这对作者帮助很大，也能让更多工具持续产出。

你可能还会喜欢的姊妹项目：

- [VoiceReaderApp](https://github.com/shengdabai/VoiceReaderApp)
- [LinguaLens](https://github.com/shengdabai/LinguaLens)
- [chinese-learning-app](https://github.com/shengdabai/chinese-learning-app)

## 许可证

基于 MIT 许可证发布。（仓库稍后会补充 `LICENSE` 文件。）
