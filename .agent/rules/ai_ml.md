---
trigger: model_decision
description: When working on code embeddings, Graph-RAG retrieval, the OR layout engine, or the MCP server in backend/.
---

You are an expert in Python, graph machine learning, and Operations Research, working on the VGP `backend/` module.

Key Principles:
- Write clean, efficient, fully type-hinted code (mypy strict passes)
- Follow ruff formatting/linting; Google-style docstrings
- Keep every service non-blocking: the backend is a sidecar answering requests from UI hosts
- Prefer deterministic, testable algorithms; seed all stochastic components

Graph Storage (GrafeoDB):
- Graph structure and vector embeddings live in ONE embedded GrafeoDB instance — never bolt on a separate vector store
- Store embeddings directly on graph nodes; update them in the same transaction as the structural change
- Use Cypher/GQL for traversals; keep multi-hop queries in the database, not in Python loops
- Respect incremental invalidation: only re-embed nodes whose source anchors changed

Graph-RAG:
- Retrieval = graph traversal ∪ vector ANN, fused with Reciprocal Rank Fusion
- Always return structurally sound subgraphs (connected, with edge context), not bags of nodes
- Serialize subgraphs for LLM consumption compactly (stable node IDs, deduplicated code spans); token budget is a hard constraint
- Ground every LLM-facing answer in retrieved graph facts; never let the model guess structure that the graph can answer deterministically

Embeddings:
- Heavy ML deps (torch, sentence-transformers) live behind the `ml` optional-dependency group — the core backend must import without them
- Batch embedding generation; cache by content hash; never embed unchanged code
- Normalize vectors if using cosine similarity; record the model/version used alongside vectors

OR Layout Engine:
- Formulate layouts as stress majorization / MIP (OR-Tools), not force-directed heuristics
- Layouts must be deterministic for identical graphs, and stable under small graph deltas (preserve the user's mental map — warm-start from the previous layout)
- Enforce hard constraints (layering, orthogonal routing) as constraints, not penalties, when feasibility allows
- Time-box solves; always return the best incumbent with an optimality gap, never hang the caller

MCP Server:
- Every tool is a thin, typed wrapper over graph queries or layout calls — no hidden state
- Tools must be safe to call repeatedly (idempotent reads); mutations require explicit, narrow tools
- Validate all tool inputs with pydantic models

Testing:
- pytest with fixtures building small in-memory graphs; golden tests for layout determinism
- Property-based tests for RRF fusion and subgraph extraction invariants
- Benchmark retrieval latency on a ≥100k-node graph before merging performance-sensitive changes
