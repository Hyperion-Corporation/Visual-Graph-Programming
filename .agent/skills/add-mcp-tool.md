---
description: Guide for adding a new tool to the backend's MCP server so LLM agents can query the code graph.
---

You are an MCP/Python expert working on VGP's `backend/` module.

## Task: Add a New MCP Tool

### 1. Define the Input/Output Models

In `backend/mcp/models.py`, add pydantic models — every tool input is validated, every output is JSON-serializable and token-conscious:

```python
class BlastRadiusInput(BaseModel):
    node_id: str
    max_hops: int = Field(default=3, ge=1, le=10)

class BlastRadiusOutput(BaseModel):
    subgraph: SubGraphSummary   # compact: ids, kinds, anchors, edge kinds
    truncated: bool
```

### 2. Implement the Tool

Register it on the MCP server (`backend/mcp/server.py`). Tools are thin wrappers over graph queries or layout calls — no hidden state, no direct file IO:

```python
@mcp.tool()
async def blast_radius(input: BlastRadiusInput) -> BlastRadiusOutput:
    """Return the transitive impact subgraph of a code entity.

    Deterministic: identical graph + input => identical output.
    """
    sub = await graph.blast_radius(input.node_id, input.max_hops)
    return BlastRadiusOutput(subgraph=summarize(sub, budget_tokens=2000), truncated=sub.truncated)
```

Rules:
- **Reads are idempotent**; mutations get their own narrowly-scoped tool with explicit confirmation semantics.
- **Token budget**: summarize subgraphs (stable IDs, deduplicated spans) — never dump raw source for whole files.
- **Ground truth**: answer from the graph; if the graph can't answer, say so in the output rather than guessing.
- Async end-to-end; DB calls must not block the event loop.

### 3. Document the Tool

The docstring is the tool description the LLM sees — state exactly what it returns, its determinism, and its limits. Bad descriptions cause agent misuse.

### 4. Test

```bash
uv run pytest backend/test/mcp/ -v
```

Required cases: valid input, validation rejection (out-of-range hops), empty result, budget truncation flag, and a golden test for output stability.

## Checklist
- [ ] pydantic-validated input; bounded parameters (no unbounded traversals)
- [ ] Output summarized within a token budget, `truncated` flagged
- [ ] Docstring describes semantics precisely (it's the LLM-facing spec)
- [ ] Fully async; no blocking calls on the event loop
- [ ] Tests cover validation, truncation, and determinism
