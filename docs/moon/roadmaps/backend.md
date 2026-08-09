# Backend Module Roadmap — Python ML, Layout, MCP

Detail for Track A's `backend/` half — see [`../ROADMAP.md`](../ROADMAP.md)'s
Track A for the checklist as tracked on the board.
*Board view: [views/8](https://github.com/users/ACFHarbinger/projects/13/views/8).*

`backend/` is the intelligence sidecar: embeddings, Graph-RAG retrieval, the
OR layout engine, the MCP server, and commit-to-commit diffing. It depends
on `base/`'s GrafeoDB ingestion (via A1.5) being stable before A2.2+ can
build on top of it.

## Milestone A2 — Python Backend (ML, Layout, MCP)

- [ ] **A2.1** Scaffold the `backend/` Python package: module layout, uv-managed deps in `pyproject.toml`, pytest + ruff + mypy CI.
- [ ] **A2.2** Bind to GrafeoDB from Python and implement code-embedding generation stored on graph nodes (vector + graph in one store).
- [ ] **A2.3** Implement Graph-RAG retrieval: hybrid graph-traversal + vector-similarity search with Reciprocal Rank Fusion, returning structurally-sound subgraphs.
- [ ] **A2.4** Implement the OR layout engine: stress-majorization and MIP-based hierarchical layouts minimizing edge crossings with orthogonal routing.
- [ ] **A2.5** Expose the graph cache to LLM agents via an MCP server (tools for structural queries, blast-radius analysis, and layout requests).
- [ ] **A2.6** Package the backend as a freezable sidecar binary (PyInstaller) consumable by the Tauri app's sidecar mechanism.
- [ ] **A2.7** Semantic visual diffing service: compute added/removed/altered graph nodes between two git commits.

## Notes

- A2.3's Graph-RAG retrieval and A2.4's OR layout engine are independent —
  they can be built in parallel once A2.2's embeddings/GrafeoDB binding
  lands.
- A2.5 (MCP server) is what `plugin/`'s and `app/`'s LLM-assistant surfaces
  ultimately depend on — don't let its tool contracts drift silently from
  what the frontends expect.
