---
description: How to build each VGP module, run its tests, and verify changes across the monorepo.
---

You are working on Visual-Graph-Programming. After any code change, follow this skill to verify correctness.

## After C++ Core Changes (`base/`)

```bash
# Configure + build (pixi provides the toolchain)
pixi run configure
pixi run build

# Debug build
pixi run build-debug

# Run GoogleTest suite via CTest
pixi run test
# or: ctest --test-dir base/build --output-on-failure

# Format
pixi run format
```

## After Python Backend Changes (`backend/`)

```bash
uv sync --all-extras          # if dependencies changed

uv run pytest                 # all tests
uv run pytest backend/test/test_layout.py -v   # one file
uv run ruff check . && uv run ruff format --check .
uv run mypy backend
```

## After VS Code Extension Changes (`extension/`)

```bash
npm run build:extension       # type-check + bundle (from repo root)
npm run test --workspace=extension
npm run lint --workspace=extension

# Manual verification: open extension/ in VS Code, press F5
# (Extension Development Host), run "VGP: Show Code Graph".
```

## After Tauri App Changes (`app/`)

```bash
# React UI only
npm run test --workspace=app
npm run check-types --workspace=app

# Rust core
cargo test          # from repo root (workspace)
cargo clippy -- -D warnings
cargo fmt --check

# Full dev run (compiles Rust + starts Vite)
npm run dev:app
```

## After Unreal Plugin Changes (`plugin/`)

```bash
# Regenerate project files and compile against the pinned engine version;
# from a UE project embedding the plugin:
#   Linux: <UE>/Engine/Build/BatchFiles/Linux/Build.sh <Target>Editor Linux Development
# Then open the editor and confirm the plugin loads without errors.
```

## Full Pre-Commit Checklist

```bash
pixi run test                         # 1. C++ tests
uv run pytest && uv run ruff check .  # 2. Python tests + lint
npm test && npm run lint              # 3. TS tests + lint (both workspaces)
cargo test && cargo clippy -- -D warnings   # 4. Rust
```

## Common Build Failures

| Error | Fix |
|---|---|
| `cmake: command not found` | Run inside pixi: `pixi run configure` (or `pixi install` first) |
| Tree-sitter headers missing | `pixi install` (conda-forge provides tree-sitter) or let CMake FetchContent fetch it |
| `webkit2gtk-4.1 not found` (Tauri, Linux) | `sudo apt install libwebkit2gtk-4.1-dev` |
| `Cannot find module '@types/vscode'` | `npm install` from the repo root (workspaces) |
| `mypy` can't find `backend` | Package not installed: `uv sync` then re-run |
| Cargo can't resolve workspace deps | Run from the repo root, not inside `app/src-tauri` |
