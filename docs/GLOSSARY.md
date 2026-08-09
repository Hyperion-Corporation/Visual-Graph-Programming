# Glossary

Terms used across VGP's code, docs, and issue tracker.

**Byte-offset anchor** — The `file_id`/`start_byte`/`end_byte` triple every
source-mapped graph node/edge carries, kept in sync with tree-sitter's
`tree.edit()` on every text change. See `.agent/AGENTS.md`'s non-negotiable
invariants — a stale anchor is a CRITICAL-severity bug.

**Code property graph (CPG)** — The unified AST + control-flow + data-flow
multigraph VGP builds from parsed source and stores in GrafeoDB. The graph
views in every frontend are projections of this graph, not a separate model.

**GrafeoDB** — The embedded graph + vector database (one store, both
representations) that `base/` ingests the code property graph into, and
that `backend/` queries for Graph-RAG retrieval.

**Graph-RAG** — Retrieval-augmented generation over the code property graph:
graph traversal (multi-hop structural queries) fused with vector similarity
search (via Reciprocal Rank Fusion) to ground LLM answers in actual code
structure instead of raw text search.

**MCP (Model Context Protocol)** — The protocol `backend/`'s sidecar server
exposes the code property graph through, so LLM agents can query it as a
structured tool rather than grepping source text.

**OR-optimized layout** — Node/edge positions computed via Operations
Research techniques (stress majorization, mixed-integer programming
refinement) instead of force-directed simulation, chosen for deterministic,
readable output instead of "hairball" layouts on dense graphs.

**Sidecar** — A subprocess the Tauri app (`app/`) supervises: the C++ core
(`base/`) via its C API, and the Python backend (`backend/`) via stdio/
WebSocket. Neither sidecar ever blocks a UI thread — see invariant 3 in
`.agent/AGENTS.md`.

**Text-as-source-of-truth** — The design principle that the graph is always
a synchronized projection of the text on disk, never an independently
persisted state that could contradict it. Graph edits translate to
lossless, syntax-preserving text edits — never the other way around.
