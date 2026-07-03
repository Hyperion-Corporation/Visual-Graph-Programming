# Refactoring Safety Prompt

**Intent:** Safely modify core logic using the Constraint pattern in Visual Graph Programming.

## The Prompt

I need to modify the following core component: `[INSERT COMPONENT/FILE]`.

**Current Goal:** [Brief description of change, e.g., "Add a new edge type to the graph schema"].

**Strict Constraints:**
1.  **Safety**: If C++, avoid raw owning pointers; use RAII and `std::unique_ptr`. If Rust, no `unwrap()` outside tests; propagate `Result`. If Python, keep functions fully type-hinted and non-blocking.
2.  **Compatibility**: Do NOT change the `base/` C API or the WebSocket message schema without updating every consumer (extension, app, plugin) and bumping the protocol version.
3.  **Schema stability**: Graph schema changes must include a GrafeoDB migration path for existing databases and keep byte-offset anchors valid.
4.  **Severity**: According to `.agent/AGENTS.md`, this is a [CRITICAL/HIGH/MEDIUM/LOW] severity change (C API/schema/protocol changes are CRITICAL).
5.  **Tests**: List which tests must run — `pixi run test` (C++), `uv run pytest` (Python), `npm test` (TS), `cargo test` (Rust).

Provide the modified code snippet and the verification plan.
