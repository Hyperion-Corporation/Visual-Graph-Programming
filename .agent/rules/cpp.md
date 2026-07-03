---
trigger: model_decision
description: When updating or creating C++ code in base/ (parsing/graph core) or plugin/ (Unreal Engine).
---

You are an expert in modern C++ (C++20) systems programming, working on the VGP parsing/graph core and the Unreal Engine plugin.

Key Principles:
- RAII everywhere; no raw owning pointers — `std::unique_ptr`/`std::shared_ptr` with clear ownership
- The core is a library first: no globals, no singletons holding mutable state; everything injectable and testable
- Exceptions do not cross the C API boundary — convert to error codes/structs at the seam
- Warnings clean under `-Wall -Wextra`; formatted with clang-format; clang-tidy findings addressed

Tree-sitter Integration:
- Always drive incremental parsing through `ts_tree_edit` + re-parse with the old tree; never full-re-parse an open buffer on keystroke
- Keep `TSTree`/`TSNode` lifetimes tied to their owning document object; nodes are invalidated by edits — copy out byte ranges, don't cache nodes
- Grammar versions are pinned; node-type names used by extraction live in one header per language

Graph Core & GrafeoDB:
- Ingestion is transactional and batched; an interrupted ingest must never leave a half-updated graph
- Byte-offset anchors are the invariant that makes graph↔text sync possible — every node/edge write carries them, every edit updates them
- Multi-hop traversals run in the database (Cypher/GQL); C++ post-processing only shapes results
- The ingest path and the query path must be safe to run concurrently (reader/writer discipline documented per component)

Threading & IO:
- The WebSocket/IPC server, file watcher, and parser workers run on dedicated threads; requests never block on parsing
- Use message queues between stages; no locks held across parse or DB calls
- All public entry points are non-blocking or explicitly documented as blocking

Stable C API (consumed by extension/app/plugin):
- `extern "C"`, versioned (`vgp_api_version()`), no STL types across the boundary — plain structs, opaque handles, explicit free functions
- Additive evolution only within a major version; breaking changes bump the major and every consumer in the same PR

Unreal Engine Plugin (`plugin/`):
- Follow UE conventions: `F`/`U`/`A`/`S` prefixes, UE containers (`TArray`, `FString`) in engine-facing code, engine allocators
- Never block the game/tick thread — talk to the core over the WebSocket bridge with async callbacks marshalled to the game thread
- Slate/UEdGraph code is presentation only; graph data comes from the core

Testing:
- GoogleTest via CTest (`pixi run test`); fixture repos under `base/test/fixtures/`
- Every parser/extraction change ships with a fixture-based regression test
- Benchmarks guard the incremental-parse and multi-hop-query latency budgets
