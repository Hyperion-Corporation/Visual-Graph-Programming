---
trigger: model_decision
description: When creating or updating TypeScript files in extension/ (VS Code) or app/src (Tauri React UI).
---

You are an expert in TypeScript development for VS Code extensions and React 19 desktop UIs (Tauri webview).

Key Principles:
- Strict mode everywhere (`"strict": true`); no `any` without a justifying comment
- Discriminated unions for all host↔webview and UI↔Rust message protocols
- Function components + hooks only; no class components
- The frontend is thin: no parsing, traversal, or persistence logic in TypeScript

Project Setup:
- Two npm workspaces from the repo root: `extension/` and `app/`
- `extension/` bundles with esbuild (`npm run build:extension`); `app/` uses Vite (`npm run dev:app`)
- Tests: Vitest in both workspaces (`npm test` from the root)
- ESLint (typescript-eslint) + Prettier; run `npm run lint` before committing

VS Code Extension (`extension/`):
- Extension host code: type all APIs against `@types/vscode`; register disposables; keep activation fast (lazy-load heavy modules)
- Webview: strict CSP, nonce-tagged scripts, `localResourceRoots` locked down; no external network resources
- Typed `postMessage` protocol in a shared `src/protocol.ts`; version messages, exhaustive-switch on kind with a `never` check
- Use `--vscode-*` CSS variables for theming; `data-vscode-context` for context menus
- LSP integration: prefer executing built-in commands (`vscode.prepareCallHierarchy`, etc.) over talking to servers directly

React UI (`app/src` and extension webview):
- React 19: use transitions for viewport-driven graph updates; `useDeferredValue` for filter inputs
- Graph canvas: `@xyflow/react` with memoized custom node/edge components; keys are stable graph node IDs
- State: zustand stores; selectors to avoid over-rendering; graph payloads never enter React state trees unnormalized
- Tauri calls: wrap `invoke` in typed client functions (`src/ipc/`), returning `Result`-like discriminated unions; listen to events with cleanup on unmount

Typing Patterns:
- Model protocol messages and graph elements with interfaces in one shared module per workspace
- Use branded types for IDs (`NodeId`, `EdgeId`, `ByteOffset`) to prevent mixups
- Type guards for runtime validation at IPC boundaries (or zod if schema complexity grows)
- Const assertions for message kind maps; exhaustiveness via `never`

Performance:
- Memoize node components (`React.memo`) and handlers (`useCallback`) on the canvas hot path
- Batch incoming graph deltas before dispatching to the store (rAF or microtask coalescing)
- Never JSON-stringify large graphs for logging in production paths

Testing:
- Vitest + @testing-library/react for components; test stores and protocol reducers as pure functions
- Mock `@tauri-apps/api` and `acquireVsCodeApi` at the module boundary
- Snapshot tests only for stable, small structures — behavior over snapshots
