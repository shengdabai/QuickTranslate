# QuickTranslate

Fast, always-on-top desktop translator (Tauri + React) — one-keystroke Chinese ⇄ English via any OpenAI-compatible LLM

## Business Context

- **Category:** education product
- **Audience:** learners, teachers, parents, and education operators who need a clearer learning or exam-prep workflow.
- **Repository status:** Public repository. Keep examples, docs, and issues free of credentials, private data, and machine-specific paths.
- **Topics:** desktop-app, llm, qwen, react, rust, tauri, translation, typescript

## What This Project Is For

- Fast, always-on-top desktop translator (Tauri + React) — one-keystroke Chinese ⇄ English via any OpenAI-compatible LLM.
- Give users a concrete learning workflow instead of a loose collection of content.
- Make practice, feedback, review, or recommendation steps easier to repeat.

## Where It Fits

This repository supports productized learning workflows: diagnostic input, guided practice, review loops, and clearer handoff between learner, teacher, and software.

## Technical Overview

- **Primary language:** TypeScript
- **Detected stack:** TypeScript, Node.js, Vite, React, Tailwind CSS
- **Default branch:** `main`
- **Visibility:** `PUBLIC`
- **License:** MIT License

## Repository Map

- `src`
- `public`
- `.vscode`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `index.html`
- `package.json`
- `pnpm-config.json`
- `pnpm-lock.yaml`
- `src-tauri`
- `tsconfig.json`

## Quick Start

Use the commands that match the current project state:

```bash
pnpm install
pnpm run dev
pnpm run preview
pnpm run build
```

| Command | Purpose |
|---|---|
| `pnpm install` | Install project dependencies. |
| `pnpm run dev` | vite |
| `pnpm run preview` | vite preview |
| `pnpm run build` | tsc && vite build |

## Operating Notes

- Keep real credentials out of the repository. Use local environment files, GitHub repository secrets, or the deployment platform secret manager.
- If a `.env.example` file exists, treat it as documentation only; never commit filled-in `.env` files.
- Before publishing screenshots, demos, or client examples, remove private names, internal paths, account IDs, and API endpoints.
- The `Repository Hygiene` workflow is a lightweight guardrail, not a replacement for product-specific tests.

## Delivery Checklist

- [ ] README describes the user, business outcome, and operating boundary.
- [ ] Setup or preview commands are current and do not rely on private machine state.
- [ ] No real secrets, private user data, or machine-local state are tracked.
- [ ] Screenshots, demos, or sample outputs are safe to share publicly when the repository is public.
- [ ] Product-specific tests or smoke checks are documented before production use.

## Roadmap

- Tighten the fastest path from clone to useful demo.
- Add project-specific screenshots, sample outputs, or a short walkthrough where useful.
- Promote repeated manual steps into scripts, tests, or documented workflows.
- Keep security, privacy, and licensing boundaries explicit as the project evolves.

## Maintainer Notes

Built by **Tony (Sheng)** — a Chinese-language teacher (6000+ students) building AI + Chinese-teaching tools in public.

If QuickTranslate is useful to you, please **⭐ Star this repo** and **[Follow @shengdabai](https://github.com/shengdabai)** — it genuinely helps and keeps the tools coming.

Sibling projects you might like:

- [VoiceReaderApp](https://github.com/shengdabai/VoiceReaderApp)
- [LinguaLens](https://github.com/shengdabai/LinguaLens)
- [chinese-learning-app](https://github.com/shengdabai/chinese-learning-app)

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

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
