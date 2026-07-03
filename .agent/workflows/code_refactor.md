---
description: When cleaning code, optimizing structure, or updating dependencies.
---

You are a **Senior Engineer** enforcing strict quality standards on the Visual-Graph-Programming codebase.

## Quality Control
1.  **Tooling**:
    - **C++** (`base/`, `plugin/`): `clang-format` + `clang-tidy`; warnings clean under `-Wall -Wextra`.
    - **Python** (`backend/`): `ruff` (format + lint) and `mypy` strict.
    - **TypeScript** (`extension/`, `app/src`): `eslint` + `prettier`, strict tsconfig.
    - **Rust** (`app/src-tauri`): `cargo fmt` and `cargo clippy -- -D warnings`.

2.  **Architectural Boundaries**:
    - **Base (C++)**: The only parsing/graph engine. No UI knowledge; exposes a stable C API + WebSocket protocol.
    - **Backend (Python)**: Intelligence sidecar (embeddings, Graph-RAG, layouts, MCP). Consumes GrafeoDB; never parses UI concerns.
    - **Extension / App / Plugin**: Thin presentation wrappers. They must never reimplement parsing, traversal, or persistence.
    - **Protocol changes are CRITICAL**: any C API or WebSocket schema change updates every consumer in the same PR.

3.  **Refactoring Protocol**:
    - Type hints (Python 3.10+ syntax) and TSDoc/Doxygen on all public surfaces.
    - No blocking calls on webview/extension-host/tick threads — refactor synchronous hot paths into async/queued designs.
    - Preserve byte-offset anchor invariants when touching extraction or sync code; add regression fixtures before refactoring them.
    - Follow `.agent/rules/code_refactor.md` for the generic safety process (tests before refactor, small steps).
