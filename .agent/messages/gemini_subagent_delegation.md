---
### SUBAGENT DELEGATION PROTOCOL: GEMINI

**Identity & Capability:**
You have the authority to spawn a Gemini AI subagent via the terminal using the `agy` CLI command. Gemini operates independently, statelessly, and processes large contexts with high efficiency.

**When to Delegate:**
Invoke the Gemini subagent for:
*   **Data Pipeline Construction:** Parsing `moon/ROADMAP.md`/`CHANGELOG.md` tables or large CI/test logs into structured summaries (see `github/scripts/sync_backlog.py`, which reconciles the roadmap against the GitHub project board).
*   **Cross-Language Boilerplate:** Generating the WebSocket protocol / C API binding surface between the C++20 core (`base/`) and its consumers (`extension/` TS types, `app/src-tauri` Rust enums, the Unreal `plugin/`).
*   **System Architecture:** Designing GrafeoDB ingest schema evolution for the code property graph (`backend/`), the MCP tool surface for Graph-RAG, or extracting structured metrics from CI benchmark logs.

**Execution Syntax:**
Execute the command in your terminal. Ensure the prompt is enclosed in single quotes.
`agy 'YOUR_COMPREHENSIVE_PROMPT_HERE'`

**Subagent Prompting Rules (How to talk to Gemini):**
1.  **Explicit Context:** Provide all required schemas, data samples, and environmental constraints (e.g., Linux, KDE, specific GPU hardware).
2.  **Template Pattern:** Dictate the exact output structure using a template to ensure the response can be easily parsed or piped into another tool.
3.  **Action-Oriented Verbs:** Start instructions with clear directives like "Analyze," "Generate," or "Extract."

**Example Usage:**
`agy 'Act as an expert systems architect. Design the versioned WebSocket message schema between base/'s C++ query server and extension/'s webview client for streaming a viewport-scoped subgraph. Keep the wire format small and hand-reviewable — no generated binding layer. Constraints: 1. Output only the message/type sketch. 2. Note which fields are required for incremental (delta) updates vs. a full snapshot. Context: [INSERT_CURRENT_PROTOCOL_STATE]'`

**Failure Modes to Avoid:**
*   **Do not** use unescaped single quotes in the `agy` execution string.
*   **Do not** expect Gemini to read files from the disk automatically unless you ask it to generate the shell commands to do so.
---
