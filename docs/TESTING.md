# Testing

Each module owns its own test suite and toolchain; there is no single
cross-module test runner.

| Module | Command | Framework |
| --- | --- | --- |
| `base/` (C++20) | `pixi run test` | GoogleTest, via CTest |
| `backend/` (Python) | `uv run pytest` | pytest (+ pytest-asyncio) |
| `extension/`, `app/` (TypeScript) | `npm test` | Vitest |
| `app/src-tauri` (Rust) | `cargo test` | Cargo's built-in test harness |

`just check` (see the root `justfile`) runs lint, test, and build for every
module in one pass — the same sequence `.github/workflows/ci.yml` (and its
`.forgejo`/`.gitea`/`.gitlab` mirrors) run on every PR.

## Coverage

Coverage is uploaded per-module with its own Codecov flag (`base`,
`backend`, `extension`, `app`, `plugin`) rather than one blended number —
see `git/codecov.yaml`. Patch coverage on new code targets 70%; project
coverage is tracked with a small allowed dip (`threshold: 1%`) rather than
a hard floor.

## What to test where

- **`base/`**: parsing correctness (tree-sitter incremental re-parse,
  anchor stability across edits), graph ingestion, the C API surface.
- **`backend/`**: Graph-RAG retrieval quality, OR layout engine output
  (stress majorization / MIP), MCP tool contracts.
- **`extension/`**: webview graph rendering, LSP call-hierarchy extraction,
  bidirectional navigation (node click → source line, and back).
- **`app/`**: React 19 UI logic (TypeScript side) and sidecar
  supervision/async command handling (Rust side).

Anchor-invariant regressions (a graph node/edge pointing at a stale
`file_id`/`start_byte`/`end_byte` after an edit) are CRITICAL severity per
`.agent/AGENTS.md` — cover them explicitly, don't rely on incidental
coverage from feature tests.
