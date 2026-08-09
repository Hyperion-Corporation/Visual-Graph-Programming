# Dependency Policy

VGP spans four dependency ecosystems; each has its own manifest and its own
bar for adding something new.

| Ecosystem | Manifest | Manager |
| --- | --- | --- |
| C++ (`base/`) | `pixi.toml` | pixi (conda-forge packages + pinned toolchain) |
| Python (`backend/`) | `backend/pyproject.toml` (root `pyproject.toml` is the uv workspace root) | uv |
| TypeScript (`extension/`, `app/`) | each workspace's `package.json` | npm workspaces |
| Rust (`app/src-tauri`) | `Cargo.toml` (workspace) + crate `Cargo.toml`s | Cargo |

## Before adding a dependency

1. **Prefer what's already there.** `backend/pyproject.toml` already
   brings in NetworkX, SciPy, OR-Tools, tree-sitter, and GrafeoDB bindings —
   check whether an existing dependency already covers the need before
   adding a new one for the same job (e.g. don't add a second graph library
   alongside NetworkX).
2. **Pin a version range, not a bare latest.** Follow the existing style in
   each manifest (e.g. `"networkx>=3.2,<4.0"` in `backend/pyproject.toml`,
   workspace-inherited versions in `Cargo.toml`).
3. **Native/system dependencies** (e.g. Tauri's `libwebkit2gtk-4.1-dev`)
   must be added to every place that provisions the build environment:
   `.devcontainer/Dockerfile`, the root `README.md`'s prerequisites, and
   every CI workflow (`.github`, `.forgejo`, `.gitea`, `.gitlab`).
4. **Heavy/optional dependencies** get their own extra rather than landing
   in the default install — see `backend/pyproject.toml`'s `ml` extra
   (PyTorch, sentence-transformers) as the pattern to follow.

## Automated updates

- `pixi.lock` is refreshed weekly by `.github/workflows/pixi-update.yml`.
- `.github/dependabot.yml` covers `pip` (for `github/`'s automation suite)
  and GitHub Actions versions. npm and Cargo dependency updates are not yet
  automated — review those manually until that's added.

## Removing a dependency

Grep for its actual usage before removing it from a manifest — an unused
manifest entry is a smaller problem than breaking a build by removing one
that's still imported somewhere.
