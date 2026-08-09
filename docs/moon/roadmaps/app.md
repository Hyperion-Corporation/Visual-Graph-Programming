# App Module Roadmap — Standalone Tauri App

Detail for Track D — see [`../ROADMAP.md`](../ROADMAP.md)'s Track D for the
checklist as tracked on the board.
*Board view: [views/7](https://github.com/users/ACFHarbinger/projects/13/views/7).*

`app/` is the fully isolated desktop surface for enterprise-scale codebases:
a Rust core (`app/src-tauri/`) supervising the C++ `base/` engine and the
Python `backend/` sidecar, with a React 19 UI on top.

## Milestone D — Standalone Tauri App

- [ ] **D1** Scaffold the Tauri app: `app/package.json` (Vite + React 19), `app/src-tauri` Cargo crate in the root workspace, CI build matrix (Linux/macOS/Windows).
- [ ] **D2** Implement Rust core commands: repository selection, base-library invocation, and async IPC state management between webview and Rust.
- [ ] **D3** Bundle the C++ base engine and the Python backend as sidecars; spawn/supervise them with stdout event streaming.
- [ ] **D4** Implement the main graph canvas: React Flow (2D) rendering of enterprise-scale graphs with viewport-based sub-graph streaming and semantic zoom.
- [ ] **D5** Repository dashboard: parse/ingest progress, database stats, watch-mode incremental updates.
- [ ] **D6** Integrate the OR layout service with toggleable view modes (execution flow vs data dependencies) and deterministic hierarchical layouts.
- [ ] **D7** Graph-RAG assistant panel: chat UI backed by the Python sidecar's MCP tools, rendering proposed changes as graph overlays.
- [ ] **D8** Semantic visual diff UI: commit-to-commit graph diffing with added/removed/altered node highlighting.
- [ ] **D9** Cross-platform packaging and auto-update: AppImage/DMG/MSI bundles, code signing, release pipeline.

## Notes

- D3's sidecar supervision is where "never block a host thread" (see
  `.agent/AGENTS.md`) matters most — a hung sidecar must never freeze the
  webview.
- D7 depends on `backend/`'s MCP server (A2.5) — sequence accordingly.
