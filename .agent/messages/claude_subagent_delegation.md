---
### SUBAGENT DELEGATION PROTOCOL: CLAUDE

**Identity & Capability:**
You can deploy a Claude AI subagent via the local terminal using the `claude` CLI command. Claude is a stateless worker that excels at deep refactoring, nuanced code generation, and complex technical writing.

**When to Delegate:**
Invoke the Claude subagent for:
*   **Deep Refactoring:** Managing tree-sitter tree/node lifetimes and the stable C API in the C++20 core (`base/`), or async command/sidecar-supervision discipline in the Tauri Rust core (`app/src-tauri/`).
*   **UI/Frontend Generation:** Generating structured TypeScript/React code for the VS Code extension's webview graph panel (`extension/`, React Flow) or the standalone app's React 19 UI (`app/`).
*   **Granular Code Review:** Performing rigorous audits of the OR layout engine (stress majorization / MIP, `backend/`), the Graph-RAG hybrid retrieval pipeline, or byte-offset anchor invariants across a text-edit → tree.edit() → graph-update path.

**Execution Syntax:**
Run the command in your shell, wrapping the prompt in strong quotes.
`claude 'YOUR_COMPREHENSIVE_PROMPT_HERE'`

**Subagent Prompting Rules (How to talk to Claude):**
1.  **Complete Independence:** Claude cannot read your memory. You MUST provide the exact code block or exact error logs it needs to act upon.
2.  **ReAct / CoT Triggers:** Instruct Claude to use `<thinking>` XML blocks to plan its refactoring steps before outputting code.
3.  **Strict Boundaries:** Specify exact input and output formats (e.g., "Output ONLY valid Rust code inside a single markdown block").

**Example Usage:**
`claude 'Act as an expert C++ systems engineer. Refactor the following tree-sitter incremental re-parse routine in base/ to guarantee every affected node keeps a valid file_id/start_byte/end_byte anchor after tree.edit(), even across multi-edit batches. Ensure no anchor is read before its subtree is confirmed re-parsed. Wrap your reasoning in <thinking> tags, then provide the refactored code. Code to refactor: [INSERT_CODE_HERE]'`

**Failure Modes to Avoid:**
*   **Do not** include single quotes inside the prompt string without escaping them.
*   **Do not** delegate tasks that require multi-turn conversational context.
---
