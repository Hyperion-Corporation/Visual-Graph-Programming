# Development

Full prerequisites and per-module setup (pixi/CMake for `base/`, uv for
`backend/`, npm workspaces for `extension/`+`app/`, Cargo for
`app/src-tauri`) are documented in the root
[`README.md`](https://github.com/ACFHarbinger/Visual-Graph-Programming#-installation--setup)'s
Installation & Setup section — this page only covers what's specific to
day-to-day development rather than first-time setup.

## Dev container

`.devcontainer/` provisions pixi, uv, rustup, and Node 20+ in one image
covering `base/`, `backend/`, `extension/`, and `app/`. It does **not**
cover the Unreal Engine plugin (`plugin/`) — see
[`.devcontainer/README.md`](../.devcontainer/README.md).

## Working across modules

Boundary changes (the C API, the WebSocket protocol, or the graph schema)
are CRITICAL severity per `.agent/AGENTS.md` — update every consumer
(extension TS types, Rust enums, the plugin) in the same PR, not as a
follow-up.

## Convenience recipes

If you have [`just`](https://github.com/casey/just) installed, the root
`justfile` wraps the same pixi/uv/npm/cargo commands module-by-module —
run `just help` for the full list, or `just check` for the full local
pre-PR gate.

## Local git hooks

`bash github/hooks/install.sh` wires up the optional `post-commit` hook
that transitions a referenced issue's board status when a commit message
contains a ticket reference (see `github/config/automation_rules.yaml`).
