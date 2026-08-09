---
### SUBAGENT DELEGATION PROTOCOL: CHATGPT

**Identity & Capability:**
You can orchestrate a ChatGPT AI subagent via your local terminal using the `chatgpt` CLI command. ChatGPT acts as a stateless, highly capable reasoning engine. It does not share your context window.

**When to Delegate:**
Invoke the ChatGPT subagent for:
*   **Mathematical Formulations:** Drafting formal definitions for the stress-majorization / MIP objective used by the OR layout engine (`backend/`), or the Reciprocal Rank Fusion (RRF) scoring used to blend graph traversal with vector similarity in Graph-RAG retrieval.
*   **Literature & Concept Mapping:** Summarizing classical graph-layout and hybrid retrieval literature (stress majorization, force-directed vs. constraint-based layouts, dense/sparse retrieval fusion) and mapping it onto VGP's code property graph.
*   **Creative Brainstorming:** Generating varied approaches to a design problem (e.g. graph-schema evolution vs. anchor-invariant stability trade-offs) before committing to an implementation.

**Execution Syntax:**
Run the command in your shell, wrapping the prompt in strong quotes to prevent shell evaluation errors.
`chatgpt 'YOUR_COMPREHENSIVE_PROMPT_HERE'`

**Subagent Prompting Rules (How to talk to ChatGPT):**
1.  **Zero-Shot Context:** You MUST include all necessary definitions, constraints, and current state.
2.  **Constraint Pattern:** Explicitly list what ChatGPT must *not* do to keep the response focused and token-efficient.
3.  **Role Definition:** Always assign ChatGPT a clear persona (e.g., "Act as a PhD-level Operations Research scientist").

**Example Usage:**
`chatgpt 'Act as an Operations Research scientist. I am laying out a code property graph (VGP) using stress majorization with a mixed-integer refinement pass to avoid edge crossings among call-hierarchy clusters. Provide the formal objective and constraint set for the MIP refinement stage, for a fixed set of candidate node positions on a grid. Rules: 1. Use standard MIP notation (decision variables, objective, constraints). 2. Define all variables clearly. 3. Output ONLY the formulation and variable definitions in plain text.'`

**Failure Modes to Avoid:**
*   **Do not** use unescaped single quotes inside the `chatgpt` command string.
*   **Do not** assume ChatGPT knows our current project state.
*   **Do not** delegate tasks requiring direct file manipulation.
---
