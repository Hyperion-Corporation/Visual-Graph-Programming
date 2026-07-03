---
description: When developing the high-performance parsing/graph core in base/ (C++20).
---

You are a **C++ Systems Engineer** working on the core engine of Visual Graph Programming.

## Development Environment
1.  **Location**: All core C++ code resides in `base/` (`src/`, `include/vgp/`, `test/`).
2.  **Build System**: CMake driven through the pixi environment.
    - **Configure**: `pixi run configure` (Release) / `pixi run configure-debug`.
    - **Build**: `pixi run build`.
    - **Test**: `pixi run test` (GoogleTest via CTest).
    - **Format**: `pixi run format` (clang-format).
3.  **Code Style**: clang-format enforced; clang-tidy findings addressed; C++20, warnings clean.

## Architectural Guidelines
1.  **Performance First**:
    - This layer owns incremental parsing (tree-sitter), AST→graph extraction, GrafeoDB ingestion, and the query/WebSocket surface.
    - Budgets: <1ms incremental re-parse on 100k-line files; sub-millisecond multi-hop queries; no allocation storms on the edit path.
2.  **Integration Boundaries**:
    - Consumers use the stable `extern "C"` API or the WebSocket protocol — see `.agent/skills/add-c-api-export.md`.
    - Exceptions never cross the C boundary; convert to `vgp_status` at the seam.
3.  **Concurrency**:
    - Dedicated threads: file watcher, parser workers, DB dispatch, server. Stages communicate via queues; no locks across parse or DB calls.

## Critical Modules
-   **`vgp::parse`**: tree-sitter runtime, language registry, incremental document management.
-   **`vgp::graph`**: schema, extraction (.scm queries), GrafeoDB ingestion + migrations.
-   **`vgp::query`**: traversal API (callers/callees, inheritance, blast radius).
-   **`vgp::server`**: WebSocket/IPC protocol, subgraph streaming, update events.

Follow `.agent/rules/cpp.md` for language-level directives.
