# Debugging Prompt

**Intent:** Resolve runtime issues using ReAct logic and existing project utilities in Visual Graph Programming.

## The Prompt

I am encountering a specific error: `[INSERT ERROR HERE]`.

Context:
- **Component**: [base C++ core / backend Python sidecar / VS Code extension / Tauri app (React UI or Rust core) / Unreal plugin]
- **Operation**: [e.g., incremental parse, graph ingestion, layout computation, webview rendering, sidecar spawn]

Task:
Analyze the provided code snippets (or suggest which files to read). Identify potential causes such as:
1. **Stale byte offsets**: Was `tree.edit()` called with wrong ranges after a text change, desynchronizing graph anchors from the buffer?
2. **Blocking a host thread**: Is the webview/extension host/engine tick thread waiting synchronously on a parse, GrafeoDB query, or LLM call?
3. **IPC overload**: Is a large graph payload being serialized over postMessage/WebSockets instead of streamed as viewport-scoped pages?
4. **Sidecar failure**: Did the Tauri app fail to spawn the C++/Python sidecar (missing binary, wrong path in the bundle, stdout not consumed)?
5. **Database state**: Is a GrafeoDB transaction left open, or is the ingest layer writing during a concurrent traversal?
6. **Grammar mismatch**: Does the loaded tree-sitter grammar version match the node types the extraction layer expects?

Propose a fix that adheres to the "never block a host thread" and "text is the single source of truth" rules.
