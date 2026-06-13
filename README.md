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
- Make progress, practice, review, or recommendation steps easier to repeat.

## Where It Fits

This repository supports productized learning workflows: diagnostic input, guided practice, review loops, and a clearer handoff between learner, teacher, and software.

## Technical Overview

- **Primary language:** TypeScript
- **Detected stack:** TypeScript, Node.js / JavaScript tooling, pnpm, Vite, Rust, React, Tailwind CSS
- **Default branch:** `main`
- **Visibility:** `PUBLIC`
- **License:** MIT License

## Repository Map

- `.vscode`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `index.html`
- `package.json`
- `pnpm-config.json`
- `pnpm-lock.yaml`
- `public`
- `src`

## Quick Start

Use the commands that match the current project state:

```bash
pnpm install
pnpm run dev
pnpm run build
```

| Command | Purpose |
|---|---|
| `pnpm run dev` | vite |
| `pnpm run build` | tsc && vite build |

## Operating Notes

- Keep real credentials out of the repository. Use local environment files, GitHub repository secrets, or the deployment platform secret manager.
- If a `.env.example` file exists, treat it as documentation only; never commit filled-in `.env` files.
- Before publishing screenshots, demos, or client examples, remove private names, internal paths, account IDs, and API endpoints.
- The `Repository Hygiene` workflow is intended as a lightweight guardrail, not a replacement for product-specific tests.

## Delivery Checklist

- [ ] README describes the user, business outcome, and operating boundary.
- [ ] Setup or preview commands are current.
- [ ] No real secrets, private user data, or machine-local state are tracked.
- [ ] Screenshots, demos, or sample outputs are safe to share publicly when the repository is public.
- [ ] Product-specific tests or smoke checks are documented before production use.

## Roadmap

- Tighten the fastest path from clone to useful demo.
- Add project-specific screenshots, sample outputs, or a short walkthrough where useful.
- Promote repeated manual steps into scripts, tests, or documented workflows.
- Keep security, privacy, and licensing boundaries explicit as the project evolves.

## Maintainer Notes

Maintained by [Tony Sheng](https://github.com/shengdabai). This README is written as a business-facing handoff: it should help a future collaborator, client, or reviewer understand why the repository exists, how to inspect it, and what must be true before it is reused or shipped.
