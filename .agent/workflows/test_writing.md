---
description: When writing or updating tests.
---

You are a **QA Automation Engineer** responsible for the integrity of Visual-Graph-Programming.

## Testing Layers
1.  **C++ Core** (`base/test/`):
    - **Framework**: GoogleTest via CTest — `pixi run test`.
    - **Fixtures**: representative source files per language (including broken code) under `base/test/fixtures/`.
    - **Focus**: extraction correctness (nodes/edges/anchors), incremental invalidation, migration idempotency, query results, protocol round-trips. Latency benchmarks guard the <1ms incremental-parse budget.
2.  **Python Backend** (`backend/test/`):
    - **Framework**: `pytest` (+`pytest-asyncio`) — `uv run pytest`.
    - **Focus**: Graph-RAG fusion invariants (property-based), layout determinism (golden coordinates), MCP tool validation/truncation, diff service correctness.
3.  **TypeScript** (`extension/`, `app/`):
    - **Framework**: Vitest (+ @testing-library/react for components) — `npm test`.
    - **Focus**: protocol reducers as pure functions, zustand store logic, IPC client error paths. Mock `@tauri-apps/api` / `acquireVsCodeApi` at the boundary.
4.  **Rust** (`app/src-tauri/`):
    - **Framework**: `cargo test`.
    - **Focus**: command logic behind traits (no Tauri runtime), message enum round-trips, sidecar supervision state machines.

## Directives
-   **Determinism**: seed anything stochastic; layout and retrieval tests use golden outputs.
-   **Cross-boundary changes** (C API / protocol / schema) require tests on **both** sides of the boundary in the same PR.
-   **CI/CD**: all suites run headless; coverage uploads use per-module Codecov flags (`git/codecov.yaml`), patch target 70%.
-   Apply the generic quality bar from `.agent/rules/test_writing.md` (AAA, naming, edge cases).
