# Architectural Analysis Prompt

**Intent:** Use Chain-of-Thought reasoning to explore the boundaries between the C++ core, the Python backend, and the frontends in Visual Graph Programming.

## The Prompt

I need to understand the interface between the C++ parsing/graph core and its consumers.

Using **Chain-of-Thought reasoning**, analyze the relationship between:
- The C++ core's stable C API and WebSocket protocol in `base/` (parsing service, GrafeoDB ingestion, graph query surface).
- The Python backend in `backend/` (GrafeoDB bindings, Graph-RAG retrieval, OR layout engine, MCP server).
- The frontend consumers: the VS Code extension host (`extension/`), the Tauri Rust core (`app/src-tauri/`), and the Unreal Engine plugin (`plugin/`).
- The data passed across boundaries: syntax subtrees with byte-offset anchors, graph node/edge batches, viewport-scoped subgraph pages, and layout coordinate sets.

Explain potential bottlenecks in data marshalling, for example:
1. Is a whole-workspace graph ever serialized over the IPC/postMessage queue instead of streamed as viewport-scoped subgraphs?
2. Are incremental parse results (`tree.edit()`) propagated as deltas, or does a consumer trigger full re-ingestion?
3. Do graph queries run on a host UI/tick thread instead of the core's worker threads?
4. Are embeddings and graph structure kept in one GrafeoDB transaction, or split across stores?

Suggest concrete optimizations based on the provided code, respecting the rule that `base/` remains the single engine and frontends stay thin.
