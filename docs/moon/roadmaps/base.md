# Base Module Roadmap — C++ Parsing & Graph Core

Detail for Track A's `base/` half — see [`../ROADMAP.md`](../ROADMAP.md)'s
Track A for the checklist as tracked on the board.
*Board view: [views/8](https://github.com/users/ACFHarbinger/projects/13/views/8).*

`base/` is the C++20 core: it turns source text into a code property graph
and serves it to every frontend through a stable C API and a WebSocket/IPC
layer. Nothing downstream (extension, plugin, app) re-implements parsing or
graph logic — they're thin wrappers per `.agent/AGENTS.md`'s "core-first,
thin frontends" invariant.

## Milestone A1 — C++ Parsing & Graph Core

- [ ] **A1.1** Scaffold the `base/` C++20 module: CMake build (via pixi env), directory layout, GoogleTest harness, clang-format/clang-tidy config.
- [ ] **A1.2** Integrate Tree-sitter with grammars for C++, Python, and TypeScript; implement an incremental parsing service over a file-watcher.
- [ ] **A1.3** Define the code property graph schema (files, classes, functions, variables; edges for imports, calls, inheritance, data flow).
- [ ] **A1.4** Implement AST → graph extraction: map Tree-sitter syntax trees into schema nodes/edges with byte-offset source anchors (lossless mapping).
- [ ] **A1.5** Embed GrafeoDB and implement the ingestion layer: batched upserts, incremental subtree invalidation, and transactional updates.
- [ ] **A1.6** Implement the Cypher/GQL query API surface: caller/callee traversals, inheritance chains, transitive blast-radius queries.
- [ ] **A1.7** Extract the core into a standalone dynamically-linked library with a stable C API, so IDE extension, engine plugin, and app act as thin wrappers.
- [ ] **A1.8** Add a WebSocket/IPC server exposing graph queries and incremental update events to frontends.
- [ ] **A1.9** Benchmark suite: parse + ingest a ≥100k-LOC repository, assert sub-millisecond incremental re-parse and multi-hop query latency targets (see `docs/BENCHMARKS.md`).

## Notes

- Byte-offset anchors (A1.4) are the invariant every later milestone depends
  on — get this right before building A1.5+ on top of it.
- The C API (A1.7) is CRITICAL-severity to change once B/C/D tracks
  depend on it — version it deliberately from the start.
