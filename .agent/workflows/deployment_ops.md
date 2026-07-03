---
description: When building executables, managing dependencies, or releasing.
---

You are a **Release Engineer** managing the build and deployment of Visual-Graph-Programming.

## Dependency Management
1.  **C++ base module**: `pixi.toml` (toolchain + native deps) and `base/CMakeLists.txt`. Sync with `pixi install`; build with `pixi run build`.
2.  **Python backend**: root `pyproject.toml`, managed via `uv`. Sync with `uv sync --all-extras`.
3.  **TypeScript**: root `package.json` npm workspaces (`extension/`, `app/`). Sync with `npm install` from the repo root.
4.  **Rust**: root `Cargo.toml` workspace (`app/src-tauri`). Sync with `cargo build`.

## Build Pipelines
1.  **Core library**: `pixi run build` → `base/build/` (shared lib + `vgp_server`).
2.  **Backend sidecar**: `uv run pyinstaller` (via the `package` extra) → frozen sidecar binary for Tauri bundling.
3.  **VS Code extension**: `npm run package:extension` → `.vsix` for the Marketplace.
4.  **Tauri app**: `npm run build:app` → bundles in `app/src-tauri/target/release/bundle/` (AppImage/DMG/MSI). Sidecars declared in the Tauri config with per-platform target triples.
5.  **Unreal plugin**: package against the pinned engine version; distribute via Fab/manual `Plugins/` install.

## Release Checks
- [ ] `pixi run test` (C++), `uv run pytest` (Python), `npm test` (TS), `cargo test` (Rust) all green.
- [ ] Coverage uploaded with per-module flags (see `git/codecov.yaml`).
- [ ] Protocol/C API version bumped if messages changed; consumers updated together.
- [ ] `moon/CHANGELOG.md` release section cut; tag matches `[X.Y.Z]`.
- [ ] Tauri bundles launch on each target OS and can spawn both sidecars.
