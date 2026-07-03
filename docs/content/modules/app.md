# Tauri App (`app/`)

The standalone desktop application for enterprise-scale codebases.

**Responsibilities**

- React 19 graph canvas with viewport streaming and semantic zoom
- Rust core (`app/src-tauri/`): async Tauri commands, sidecar supervision,
  WebSocket client to the base graph service
- Bundling of the C++ engine and frozen Python backend as sidecars
- Graph-RAG assistant panel, semantic diff UI, repository dashboard

**Build & test**

```bash
npm install            # repo root (workspaces)
npm run dev:app        # full dev run (Rust + Vite)
npm run test --workspace=app
cargo test             # Rust core (workspace, from repo root)
```

## API References

Two generated references cover this module:

- **TypeScript UI** (TypeDoc from `app/src/`):
  [Browse the TypeDoc API docs](../api/app/index.html)
- **Rust core** (rustdoc from `app/src-tauri/`):
  [Browse the rustdoc API docs](../api/rust/vgp_app_lib/index.html)

*(both available after `bash docs/build_docs.sh`)*

TypeDoc configuration: [`docs/app/typedoc.json`](https://github.com/ACFHarbinger/Visual-Graph-Programming/blob/main/docs/app/typedoc.json);
rustdoc needs no configuration — public items carry `///` doc comments
(see `.agent/rules/rust.md`).
