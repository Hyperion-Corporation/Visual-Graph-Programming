# Benchmarks

Performance targets that back the invariants in `.agent/AGENTS.md`. This
tracks *targets*, not yet a live dashboard — wire in real numbers here as
each module's benchmark suite comes online (see `component:ci-automation`
issues for that work).

| Target | Threshold | Why |
| --- | --- | --- |
| Incremental re-parse (per edited subtree) | < 1ms | `base/`'s tree-sitter pipeline must keep up with live typing without visible lag |
| Graph ingest (per invalidated region) | Incremental, never a full-workspace re-ingest | Re-ingesting an entire workspace graph on every edit doesn't scale past small codebases |
| Viewport subgraph fetch (webview ⇄ core) | Streamed, viewport-scoped | Never serialize a whole workspace graph over IPC — see invariant 4 |
| OR layout (stress majorization / MIP refinement) | Deterministic, no visible "settling" jitter | Force-directed layouts are excluded specifically because they don't converge predictably on dense graphs |
| Graph-RAG retrieval (hybrid graph + vector) | Sub-second for typical multi-hop queries | LLM-facing latency budget for MCP tool calls |

## Where to measure

- **`base/`**: GoogleTest benchmark cases (or a dedicated `pixi run bench`
  task once added) around the incremental parse and ingest paths.
- **`backend/`**: pytest-benchmark (or similar) around Graph-RAG retrieval
  and the OR layout engine.
- **`extension/`/`app/`**: frame timing on the webview graph canvas under a
  representative large-graph fixture.

## Reporting a regression

Include the exact fixture (repo size, graph node/edge count) and the
before/after numbers — "it feels slower" isn't actionable without a
reproducible measurement.
