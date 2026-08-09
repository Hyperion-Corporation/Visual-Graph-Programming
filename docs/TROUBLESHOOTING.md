# Troubleshooting

Common setup and build problems, by module.

## Tauri app (`app/`) won't build on Linux

Missing webview/native dependencies. Install the packages listed in the
root `README.md`'s prerequisites:

```bash
sudo apt install -y build-essential curl wget file libssl-dev \
  libgtk-3-dev libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev
```

The `.devcontainer/` image already has these — if you're not using it,
this is almost always the first thing to check.

## `pixi run build` fails with a missing compiler/CMake error

Run `pixi install` first — the C++ toolchain (CMake, Ninja, compilers,
tree-sitter) is provisioned by pixi, not assumed to be on your system PATH.
See the root `README.md`'s "C++ Base Module (pixi + CMake)" section.

## `uv sync` fails resolving `grafeo`

GrafeoDB bindings require Python 3.12+ (see `backend/pyproject.toml`'s
`requires-python`). Check `python3 --version` and `uv python list` — if
you're on an older interpreter, `uv sync` will fail to resolve rather than
silently downgrading the dependency.

## npm workspace commands fail with "workspace not found"

Run npm commands from the repository root, not from inside `extension/` or
`app/` — the root `package.json` declares the npm workspaces
(`npm run build:extension`, `npm run dev:app`, etc.), and per-workspace
`npm install --workspace=...` still needs to run from root.

## CI passes locally but fails on a `.forgejo`/`.gitea` mirror

`agent-sync.yml` is intentionally a no-op there — it targets the GitHub
Projects (v2) GraphQL API, which has no equivalent on Forgejo/Gitea. That
failure is expected, not a bug; see the workflow's own guard step for why.

## A graph node/edge looks like it's pointing at the wrong line

This is an anchor invariant violation (`file_id`/`start_byte`/`end_byte`
gone stale after an edit) — see `.agent/AGENTS.md`'s non-negotiable
invariants. It's CRITICAL severity; file it with a minimal repro (the edit
sequence that produced the drift), not just the end state.
