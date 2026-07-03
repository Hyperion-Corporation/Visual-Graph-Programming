# Feature Implementation Prompt

**Intent:** Implement a new feature while maintaining architectural boundaries in Visual Graph Programming.

## The Prompt

I need to implement a new feature: `[INSERT FEATURE NAME]`.
**Goal:** [Brief description of what the feature does].
**Roadmap step:** [e.g., A1.5, B6, C7, D4 — see moon/ROADMAP.md].
**Dependencies:** [List relevant core APIs, backend services, or UI panels].

**Strict Constraints:**
1. **Module placement**: Parsing/graph/query logic -> `base/` (C++). ML, layout math, Graph-RAG, MCP -> `backend/` (Python). Editor UX -> `extension/`. Desktop UI -> `app/` (React) with commands in `app/src-tauri/` (Rust). Engine editor UX -> `plugin/`.
2. **Thin frontends**: Frontends consume the core via its C API / WebSocket protocol — never reimplement parsing or graph traversal in a frontend.
3. **Concurrency**: No synchronous parse/DB/LLM work on a webview, extension host, or engine tick thread; stream results incrementally.
4. **Source of truth**: Graph mutations must translate to lossless, syntax-preserving text edits with updated byte-offset anchors.
5. **Tests**: Ship with tests in the owning module (GoogleTest / pytest / Vitest / cargo test).

Provide a plan or code snippet for the implementation, ensuring the UI stays responsive on enterprise-scale graphs.
