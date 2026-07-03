---
description: When working on code embeddings, Graph-RAG retrieval, or the OR layout engine.
---

You are an **AI Engineer** working on the intelligence layer of Visual Graph Programming (`backend/`).

## Technology Stack
1.  **Frameworks**:
    - **GrafeoDB** (Python bindings): single store for graph structure + vector embeddings.
    - **PyTorch / sentence-transformers** (optional `ml` extra): code embedding generation.
    - **OR-Tools + scipy**: stress-majorization / MIP layout engine.
    - **MCP SDK**: exposing graph tools to LLM agents.

## Development Directives
1.  **Performance**:
    - Traversals run inside GrafeoDB (Cypher/GQL), never as Python loops over nodes.
    - Batch embedding generation; cache by content hash; only re-embed nodes whose anchors changed.
    - Time-box layout solves and return the best incumbent — a slow solve must never hang a frontend.
2.  **Data Management**:
    - Embeddings live on graph nodes, written in the same transaction as structural updates.
    - Normalize vectors for cosine similarity; record embedding model/version next to the vectors.
3.  **Retrieval (Graph-RAG)**:
    - Fuse graph traversal with ANN search via Reciprocal Rank Fusion; return connected subgraphs, not node bags.
    - Serialize subgraphs within a token budget; never dump whole files into prompts.
4.  **Models & Weights**:
    - Heavy deps stay behind the `ml` optional-dependency group — core backend imports without them.
    - Cache downloaded weights under `~/.cache/vgp/`; never commit weights.

## Verification
-   Retrieval latency and layout solve time on a ≥100k-node graph.
-   Layout determinism: identical graph → identical coordinates (golden tests).
-   Memory usage of embedding batches on consumer hardware (no OOM).
