# QuickTranslate

A fast, lightweight desktop translation application built with Tauri and React. QuickTranslate provides seamless translation capabilities with a clean, modern interface.

## Features

- **Lightweight Desktop Application** - Built with Tauri for native performance
- **Real-time Translation** - Instant translation with minimal latency
- **Global Shortcuts** - Quick access via keyboard shortcuts
- **Customizable Settings** - Configure translation preferences and behavior
- **Cross-platform Support** - Works on macOS, Windows, and Linux
- **Modern UI** - Clean, intuitive interface with Tailwind CSS

## Technology Stack

- **Frontend**: React 19, TypeScript
- **UI Framework**: Tailwind CSS v4
- **Desktop Framework**: Tauri 2
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Installation

### Prerequisites

- Node.js 18 or higher
- Rust 1.70 or higher
- pnpm package manager

### Steps

1. Clone the repository:
```bash
git clone https://github.com/shengdabai/QuickTranslate.git
cd QuickTranslate
```

2. Install dependencies:
```bash
pnpm install
```

3. Install Rust dependencies:
```bash
pnpm tauri dev
```

## Usage

### Development Mode

Start the application in development mode:
```bash
pnpm tauri dev
```

### Build for Production

Build the application for your platform:
```bash
pnpm tauri build
```

### Running the Application

After building, you'll find the application executable in:
- `src-tauri/target/release/` on Linux and Windows
- `src-tauri/target/release/bundle/` on macOS

### Keyboard Shortcuts

- **Ctrl+Shift+T**: Quick translate shortcut (configurable)
- **Ctrl+,**: Open settings

## Configuration

The application settings can be accessed through the settings interface. You can configure:
- Translation preferences
- Keyboard shortcuts
- UI themes
- Language pairs

## Project Structure

```
QuickTranslate/
├── src/                    # React source code
│   ├── components/        # React components
│   ├── App.tsx           # Main application component
│   └── ...
├── src-tauri/             # Tauri backend
│   ├── src/              # Rust source code
│   ├── tauri.conf.json   # Tauri configuration
│   └── ...
├── public/               # Static assets
├── package.json          # Node.js dependencies
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# QuickTranslate

一款快速、轻量级的桌面翻译应用程序，基于 Tauri 和 React 构建。QuickTranslate 提供无缝的翻译功能，界面简洁现代。

## 功能特性

- **轻量级桌面应用** - 基于 Tauri 构建，性能优异
- **实时翻译** - 低延迟，即时翻译
- **全局快捷键** - 通过键盘快捷键快速访问
- **可自定义设置** - 配置翻译偏好和行为
- **跨平台支持** - 支持 macOS、Windows 和 Linux
- **现代 UI** - 使用 Tailwind CSS 的简洁直观界面

## 技术栈

- **前端**: React 19, TypeScript
- **UI 框架**: Tailwind CSS v4
- **桌面框架**: Tauri 2
- **状态管理**: React Hooks
- **构建工具**: Vite
- **包管理器**: pnpm

## 安装

### 前置要求

- Node.js 18 或更高版本
- Rust 1.70 或更高版本
- pnpm 包管理器

### 步骤

1. 克隆仓库：
```bash
git clone https://github.com/shengdabai/QuickTranslate.git
cd QuickTranslate
```

2. 安装依赖：
```bash
pnpm install
```

3. 安装 Rust 依赖：
```bash
pnpm tauri dev
```

## 使用方法

### 开发模式

启动开发模式的应用：
```bash
pnpm tauri dev
```

### 构建生产版本

为您的平台构建应用：
```bash
pnpm tauri build
```

### 运行应用

构建后，您可以在以下位置找到应用程序可执行文件：
- Linux 和 Windows: `src-tauri/target/release/`
- macOS: `src-tauri/target/release/bundle/`

### 键盘快捷键

- **Ctrl+Shift+T**: 快速翻译快捷键（可配置）
- **Ctrl+,**: 打开设置

## 配置

应用设置可通过设置界面访问。您可以配置：
- 翻译偏好
- 键盘快捷键
- UI 主题
- 语言对

## 项目结构

```
QuickTranslate/
├── src/                    # React 源代码
│   ├── components/        # React 组件
│   ├── App.tsx           # 主应用组件
│   └── ...
├── src-tauri/             # Tauri 后端
│   ├── src/              # Rust 源代码
│   ├── tauri.conf.json   # Tauri 配置
│   └── ...
├── public/               # 静态资源
├── package.json          # Node.js 依赖
└── README.md             # 本文件
```

## 贡献

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交您的更改: `git commit -am 'Add new feature'`
4. 推送到分支: `git push origin feature/new-feature`
5. 提交 pull request

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。
