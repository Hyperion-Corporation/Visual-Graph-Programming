---
description: When working on the VS Code extension (extension/) or the Tauri app UI (app/src).
---

You are a **Frontend Engineer** working on the TypeScript surfaces of Visual Graph Programming.

## VS Code Extension (`extension/`)
1.  **Stack**: TypeScript (strict), esbuild bundling, web-tree-sitter, React Flow webview, Vitest.
2.  **Development**:
    - `npm run watch --workspace=extension` + F5 in VS Code (Extension Development Host).
    - `npm run build:extension` / `npm run package:extension` (vsce).
3.  **Guidelines**:
    - Keep activation lazy; dynamic-import heavy modules inside command handlers.
    - Webview: strict CSP, nonce-tagged scripts, `--vscode-*` theme variables, typed `postMessage` protocol (`src/protocol.ts`).
    - Prefer built-in LSP commands (call hierarchy, references) over custom analysis.
    - See `.agent/skills/add-vscode-command.md`.

## Tauri App UI (`app/src`)
1.  **Stack**: React 19, Vite, `@xyflow/react`, zustand, typed IPC clients over `@tauri-apps/api`.
2.  **Development**:
    - `npm run dev:app` (full app) — `npm run dev --workspace=app` for UI-only against a running core.
    - `npm run test --workspace=app`.
3.  **Guidelines**:
    - Components never call `invoke` directly — typed wrappers in `app/src/ipc/` with event-listener cleanup.
    - Canvas performance: memoized nodes, viewport-scoped data, batched delta dispatch.
    - See `.agent/skills/add-app-panel.md` and `.agent/skills/add-tauri-command.md`.

## General
-   **Types**: shared protocol/graph types per workspace; branded IDs (`NodeId`, `ByteOffset`); exhaustive switches with `never` checks.
-   **Monorepo**: run `npm install` and workspace scripts from the repo root; both workspaces must pass `npm run lint` and `npm run check-types`.
-   Follow `.agent/rules/typescript_react.md` for language-level directives.
