# AGENTS.md — Visual Graph Programming

Master governance file for AI coding agents working on this repository. The
root `CLAUDE.md` and `GEMINI.md` are pointers to this file — this is the
single source of truth.

## What This Project Is

**Visual Graph Programming (VGP)** is a multi-platform codebase visualization
and visual programming tool. It parses source code with **Tree-sitter** into a
**code property graph** stored in embedded **GrafeoDB** (graph + vectors in
one store), renders it as an interactive node graph with **OR-optimized
layouts**, and keeps graph and text **bidirectionally synchronized** through
lossless byte-offset anchors. Three deployment surfaces share one core: a
**VS Code extension**, an **Unreal Engine plugin**, and a **standalone Tauri
app** with a Python ML sidecar (Graph-RAG, MCP).

Architectural rationale lives in the research reports under `prisma/`.
The phased plan is `moon/ROADMAP.md` (synced to the GitHub project board);
release history is `moon/CHANGELOG.md`.

## Module Map & Tech Stack

| Path | Module | Stack | Env / build |
| --- | --- | --- | --- |
| `base/` | Parsing/graph core: tree-sitter, AST→graph extraction, GrafeoDB ingest, query + WebSocket server, stable C API | C++20 | `pixi.toml` + `base/CMakeLists.txt` — `pixi run configure/build/test` |
| `backend/` | Intelligence sidecar: embeddings, Graph-RAG (RRF hybrid retrieval), OR layout engine (stress majorization/MIP), MCP server, commit diffing | Python 3.12+ | root `pyproject.toml` — `uv sync --all-extras`, `uv run pytest` |
| `extension/` | VS Code extension: webview graph panel (React Flow), LSP call hierarchy, web-tree-sitter | TypeScript | npm workspace — `npm run build:extension`, `npm test` |
| `app/` | Standalone desktop app: React 19 UI + Rust core supervising C++/Python sidecars | TypeScript + Rust (Tauri 2) | npm workspace + root Cargo workspace — `npm run dev:app`, `cargo test` |
| `plugin/` | Unreal Engine 5+ editor plugin: UEdGraph/Slate visual scripting over native C++ | C++ (UE) | UE build system (roadmap Track C) |
| `github/` | Project-board automation (backlog sync, hooks, label taxonomy) | Python | `pip install -e ".[ci]"` |
| `moon/`, `git/`, `prisma/` | Roadmap/changelog, repo meta (codecov, contributing), research reports | — | — |

## Non-Negotiable Invariants

1. **Text is the single source of truth.** The graph is a synchronized
   projection of source text. Never persist graph state that contradicts the
   files on disk; graph edits translate to lossless, syntax-preserving text
   edits.
2. **Byte-offset anchors are sacred.** Every source-mapped node/edge carries
   `file_id`/`start_byte`/`end_byte`; every text edit updates them via
   tree-sitter `tree.edit()`. Stale anchors are a CRITICAL bug.
3. **Never block a host thread.** Webview UI threads, the VS Code extension
   host, and the Unreal tick thread never wait synchronously on parsing, DB
   queries, sidecars, or LLM calls.
4. **Incremental everything.** Re-parse only edited subtrees; re-ingest only
   invalidated regions; stream viewport-scoped subgraphs — never serialize a
   whole workspace graph over IPC.
5. **Core-first, thin frontends.** Parsing/traversal/persistence exist once,
   in `base/` (with intelligence in `backend/`). Frontends consume the stable
   C API / WebSocket protocol and never reimplement engine logic.
6. **Boundary changes are CRITICAL.** Any change to the C API, WebSocket
   protocol, or graph schema is versioned and updates all consumers (extension
   TS types, Rust enums, plugin) in the same PR.

## Directory of Agent Guidance (`.agent/`)

### Prompts (`prompts/`) — session starters and task templates
- `master_context.md` — session initialization with governance rules
- `architecture_analysis.md` — boundary/marshalling analysis (CoT)
- `feature_implementation.md`, `refactory_safety.md`, `debug.md`,
  `documentation_update.md`, `cli_generation.md`
- `research_web_search.md` — literature-survey directive for VGP's research axes

### Rules (`rules/`) — trigger-based directives
- `cpp.md` — C++20 core + UE plugin (tree-sitter lifetimes, C API, threading)
- `rust.md` — Tauri Rust core (async commands, sidecars, FFI seams)
- `typescript_react.md` — extension + app UI (strict TS, protocols, canvas perf)
- `gui_dev.md` — graph canvas UX (thin frontend, streaming, navigation contract)
- `ai_ml.md` — embeddings, Graph-RAG, OR layouts, MCP
- `code_refactor.md`, `error_debug.md`, `test_writing.md`,
  `reasoning_planning.md` — generic engineering discipline

### Skills (`skills/`) — step-by-step recipes
- `build-and-test.md` — per-module build/test/verify commands
- `add-c-api-export.md` — expose core functionality to all frontends
- `add-graph-schema-change.md` — evolve the code property graph safely
- `add-tree-sitter-language.md` — add a language to the pipeline
- `add-vscode-command.md`, `add-tauri-command.md`, `add-app-panel.md`,
  `add-mcp-tool.md` — per-surface feature recipes
- `debug-crash.md` — native crash/hang triage across the process tree

### Workflows (`workflows/`) — role-based module guides
- `cpp_core.md`, `rust.md`, `typescript_react.md`, `gui_dev.md`, `ai_ml.md`,
  `data_eng.md`, `test_writing.md`, `error_debug.md`, `code_refactor.md`,
  `deployment_ops.md`, `reasoning_planning.md`

## Quick Command Reference

```bash
# C++ core          # Python backend           # TypeScript              # Rust
pixi run build      uv sync --all-extras       npm install (root)        cargo build
pixi run test       uv run pytest              npm test                  cargo test
pixi run format     uv run ruff check .        npm run lint              cargo clippy -- -D warnings
                    uv run mypy backend        npm run dev:app           cargo fmt --check
```

## Process Rules

- **Issues/board**: work maps to issues on the
  [project board](https://github.com/users/ACFHarbinger/projects/13/);
  `moon/ROADMAP.md` step IDs (A1.1…D9) appear in issue titles. Reference
  tickets in commit messages — the opt-in post-commit hook
  (`bash github/hooks/install.sh`) transitions board cards automatically.
- **Docs**: user-visible changes land in `moon/CHANGELOG.md` under
  `[Unreleased]`; architectural changes update this file.
- **Quality gates**: all four test suites green; lint/type checks pass;
  coverage uploads per-module flags per `git/codecov.yaml` (patch ≥70%).
- **Contribution details**: see `git/CONTRIBUTING.md`.

## Severity Classification

| Severity | Examples |
| --- | --- |
| **CRITICAL** | C API / WebSocket protocol / graph schema changes; anchor-invariant code; ingest transactionality |
| **HIGH** | Extraction mappings, layout engine, sidecar supervision, webview protocol reducers |
| **MEDIUM** | UI panels, filters, exporters, non-core tooling |
| **LOW** | Docs, comments, fixtures, cosmetic changes |
