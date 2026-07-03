# VGP Research Web Search — Graph Visualization & Code Intelligence Literature Survey

**Intent:** Direct a research agent to perform a comprehensive, targeted web search across visualization/PL/SE literature, preprint servers (arXiv), and practical engineering resources to find methods that address the specific limitations of Visual Graph Programming's architecture. Surface both foundational theory and implementation tips adaptable to our stack. Complements the existing reports in `prisma/`.

---

## Background: What the System Does

VGP parses source code (C++, Python, TypeScript; later Verse) with Tree-sitter into a code property graph stored in embedded GrafeoDB (graph + vectors in one store), renders it as an interactive node graph (React Flow webviews; Slate/UEdGraph in Unreal), and keeps graph and text bidirectionally synchronized with lossless byte-offset anchors. Layouts are computed by an OR engine (stress majorization / MIP). A Python sidecar provides Graph-RAG retrieval and an MCP server for LLM agents.

## Research Axes (search each; prefer 2020+ but include seminal work)

### 1. Scalable graph layout
- Constrained stress majorization, layered/Sugiyama variants, orthogonal edge routing with crossing minimization guarantees.
- MIP/CP formulations of graph drawing; warm-starting layouts for incremental stability ("preserve the user's mental map").
- GPU-accelerated force simulation (cosmos.gl-style) as a fallback for exploratory views.

### 2. Incremental program analysis
- Incremental/differential dataflow for code property graphs (e.g., incremental Datalog, Viatra-style solvers).
- Error-tolerant semantic analysis on top of Tree-sitter trees; stack-graphs / SCIP-style cross-repo name resolution.

### 3. Graph databases for code
- Embedded graph DB benchmarks for multi-hop code queries (Kùzu, GrafeoDB, sqlite-based approaches).
- Hybrid retrieval: graph traversal fused with ANN vector search (RRF and learned fusion).

### 4. Graph-RAG for codebases
- AST-derived vs LLM-extracted knowledge graphs; structural blast-radius retrieval; subgraph serialization formats that minimize tokens while preserving structure.

### 5. Round-trip / projectional editing
- Lossless syntax tree editing, comment/whitespace-preserving code generation (CSTs, concrete syntax trees).
- Projectional editors (JetBrains MPS lineage), bidirectional transformations (lenses) applied to code↔graph sync.
- Visual diffing of graphs between VCS revisions.

### 6. Visual scripting in game engines
- UEdGraph/Slate extension patterns; Blueprint→C++ translation systems; Verse language tooling and Scene Graph developments.
- Live Coding / hot-patching constraints for editing compiled code from a visual layer.

## Output Format

For each axis, return:
1. **Top 3–5 sources** (paper/repo/post) with one-line relevance judgment.
2. **Adaptation sketch**: how the method maps onto our modules (`base/`, `backend/`, `extension/`, `app/`, `plugin/`).
3. **Risk/effort estimate** and which ROADMAP step (see `moon/ROADMAP.md`) it would advance.

Do **not** re-suggest what is already decided in `prisma/` reports: Tree-sitter as parser, GrafeoDB as store, Tauri for the standalone app, OR-based layouts over force-directed defaults.
