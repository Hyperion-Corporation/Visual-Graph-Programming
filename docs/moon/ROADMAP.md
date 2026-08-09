# Visual Graph Programming — Roadmap

This roadmap enumerates the implementation steps per module track. Each step
is scoped to become a ticket on the
[GitHub project board](https://github.com/users/ACFHarbinger/projects/13/);
`github/scripts/sync_backlog.py` reconciles this document against the board.
Detailed, per-module breakdowns of each track live under
[`docs/moon/roadmaps/`](roadmaps/).

Development is core-first: the C++ base and Python backend stabilize before
the host wrappers (IDE extension → engine plugin → standalone app) are built
on top of them. Architectural rationale lives in the research reports under
[`prisma/`](../../prisma/).

---

## Track A — Base + Backend Modules

*C++ parsing/graph core (`base/`) and Python ML/Graph-RAG sidecar (`backend/`).*
*Board view: [views/8](https://github.com/users/ACFHarbinger/projects/13/views/8).*
*Detail: [`roadmaps/base.md`](roadmaps/base.md), [`roadmaps/backend.md`](roadmaps/backend.md).*

### Milestone A1 — C++ Parsing & Graph Core

- [ ] **A1.1** Scaffold the `base/` C++20 module: CMake build (via pixi env), directory layout, GoogleTest harness, clang-format/clang-tidy config.
- [ ] **A1.2** Integrate Tree-sitter with grammars for C++, Python, and TypeScript; implement an incremental parsing service over a file-watcher.
- [ ] **A1.3** Define the code property graph schema (files, classes, functions, variables; edges for imports, calls, inheritance, data flow).
- [ ] **A1.4** Implement AST → graph extraction: map Tree-sitter syntax trees into schema nodes/edges with byte-offset source anchors (lossless mapping).
- [ ] **A1.5** Embed GrafeoDB and implement the ingestion layer: batched upserts, incremental subtree invalidation, and transactional updates.
- [ ] **A1.6** Implement the Cypher/GQL query API surface: caller/callee traversals, inheritance chains, transitive blast-radius queries.
- [ ] **A1.7** Extract the core into a standalone dynamically-linked library with a stable C API, so IDE extension, engine plugin, and app act as thin wrappers.
- [ ] **A1.8** Add a WebSocket/IPC server exposing graph queries and incremental update events to frontends.
- [ ] **A1.9** Benchmark suite: parse + ingest a ≥100k-LOC repository, assert sub-millisecond incremental re-parse and multi-hop query latency targets.

### Milestone A2 — Python Backend (ML, Layout, MCP)

- [ ] **A2.1** Scaffold the `backend/` Python package: module layout, uv-managed deps in `pyproject.toml`, pytest + ruff + mypy CI.
- [ ] **A2.2** Bind to GrafeoDB from Python and implement code-embedding generation stored on graph nodes (vector + graph in one store).
- [ ] **A2.3** Implement Graph-RAG retrieval: hybrid graph-traversal + vector-similarity search with Reciprocal Rank Fusion, returning structurally-sound subgraphs.
- [ ] **A2.4** Implement the OR layout engine: stress-majorization and MIP-based hierarchical layouts minimizing edge crossings with orthogonal routing.
- [ ] **A2.5** Expose the graph cache to LLM agents via an MCP server (tools for structural queries, blast-radius analysis, and layout requests).
- [ ] **A2.6** Package the backend as a freezable sidecar binary (PyInstaller) consumable by the Tauri app's sidecar mechanism.
- [ ] **A2.7** Semantic visual diffing service: compute added/removed/altered graph nodes between two git commits.

---

## Track B — IDE Extension (VS Code)

*TypeScript extension in `extension/`.*
*Board view: [views/2](https://github.com/users/ACFHarbinger/projects/13/views/2).*
*Detail: [`roadmaps/extension.md`](roadmaps/extension.md).*

- [ ] **B1** Scaffold the VS Code extension: `extension/package.json` manifest, esbuild bundling, Vitest harness, activation events and commands.
- [ ] **B2** Integrate Tree-sitter (WASM) in the extension host for local, error-tolerant AST extraction without a compilable project state.
- [ ] **B3** Implement the webview graph panel: React Flow rendering, VS Code theme-variable integration, strict CSP and message-passing protocol.
- [ ] **B4** Connect to the base module's graph service and implement sub-graph streaming/pagination to avoid IPC serialization stalls.
- [ ] **B5** Implement bidirectional call-graph views via the LSP Call Hierarchy API (incoming/outgoing traversal to a configurable depth).
- [ ] **B6** Bidirectional navigation: node click → `showTextDocument` at exact line; editor selection → highlight corresponding node.
- [ ] **B7** Semantic filtering and progressive disclosure: hide generated/test/vendor files, expand directories into functions on interaction.
- [ ] **B8** Path extraction and export: isolate root→target execution paths and export refined graphs to Mermaid/PlantUML.
- [ ] **B9** Persist webview state (`retainContextWhenHidden` + host-side serialization) and profile large-graph performance.
- [ ] **B10** Package and publish to the VS Code Marketplace with CI-driven release automation.

---

## Track C — Unreal Engine Plugin

*UE 5+ C++ plugin in `plugin/`.*
*Board view: [views/6](https://github.com/users/ACFHarbinger/projects/13/views/6).*
*Detail: [`roadmaps/plugin.md`](roadmaps/plugin.md).*

- [ ] **C1** Scaffold the UE plugin: `.uplugin` descriptor, editor module, build rules, and CI compile checks against a pinned engine version.
- [ ] **C2** Integrate the base core library (DLL) with a WebSocket bridge so graph queries never block the engine tick thread.
- [ ] **C3** Implement custom `UEdGraph`/`UEdGraphNode` classes representing C++ constructs (declarations, calls, branches, UE macros).
- [ ] **C4** Implement Slate presentation: `SGraphEditor` asset editor tab, `SGraphNode` subclasses styled after the Blueprint editor.
- [ ] **C5** Implement `UEdGraphSchema` type-checked pin validation and reflection-driven context-menu actions (functions, variables, macros).
- [ ] **C6** Integrate `tree-sitter-unreal-cpp` so UCLASS/UPROPERTY/UFUNCTION macros parse as first-class AST nodes (no destructive expansion).
- [ ] **C7** Round-trip engineering: lossless text→graph parsing and graph→text splicing via `tree.edit()` byte-range insertion, preserving comments/whitespace.
- [ ] **C8** Live Coding integration: patch `.cpp`-only edits at runtime; detect header/memory-layout changes and gate them behind an explicit "Commit to Native" rebuild flow.
- [ ] **C9** Asset-registry ingestion: visualize asset dependency graphs (materials, meshes, levels) with blast-radius queries for artists.
- [ ] **C10** Read-only logic-flow graphs for designers: state machines, behavior trees, and dialogue data with dead-end/unreachable-state detection.
- [ ] **C11** Verse syntax-to-node translation prototype: read-only Blueprint-style visual graphs generated from text-based Verse code.

---

## Track D — Standalone Tauri App

*Tauri 2 + React 19 + TypeScript app in `app/` (Rust core in `app/src-tauri/`).*
*Board view: [views/7](https://github.com/users/ACFHarbinger/projects/13/views/7).*
*Detail: [`roadmaps/app.md`](roadmaps/app.md).*

- [ ] **D1** Scaffold the Tauri app: `app/package.json` (Vite + React 19), `app/src-tauri` Cargo crate in the root workspace, CI build matrix (Linux/macOS/Windows).
- [ ] **D2** Implement Rust core commands: repository selection, base-library invocation, and async IPC state management between webview and Rust.
- [ ] **D3** Bundle the C++ base engine and the Python backend as sidecars; spawn/supervise them with stdout event streaming.
- [ ] **D4** Implement the main graph canvas: React Flow (2D) rendering of enterprise-scale graphs with viewport-based sub-graph streaming and semantic zoom.
- [ ] **D5** Repository dashboard: parse/ingest progress, database stats, watch-mode incremental updates.
- [ ] **D6** Integrate the OR layout service with toggleable view modes (execution flow vs data dependencies) and deterministic hierarchical layouts.
- [ ] **D7** Graph-RAG assistant panel: chat UI backed by the Python sidecar's MCP tools, rendering proposed changes as graph overlays.
- [ ] **D8** Semantic visual diff UI: commit-to-commit graph diffing with added/removed/altered node highlighting.
- [ ] **D9** Cross-platform packaging and auto-update: AppImage/DMG/MSI bundles, code signing, release pipeline.

---

## Cross-Cutting

*Detail: [`roadmaps/ci_automation.md`](roadmaps/ci_automation.md).*

- [ ] **X1** CI pipelines per module (build, lint, test, coverage upload with per-module Codecov flags per `git/codecov.yaml`).
- [ ] **X2** Documentation site and ADRs; keep `moon/CHANGELOG.md` current per release.
