# Contributing to Visual Graph Programming

Thank you for your interest in contributing! This guide covers the development
workflow, coding standards, and pull-request process for all modules of the
project (C++ base, Python backend, VS Code extension, Tauri app, and the
Unreal Engine plugin).

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)
- [Development Workflow](#development-workflow)
- [Commit Messages & Ticket References](#commit-messages--ticket-references)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Project Board & Automation](#project-board--automation)

## Code of Conduct

Be respectful, constructive, and collaborative. Review feedback targets the
code, never the person.

## Getting Started

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Visual-Graph-Programming.git
cd Visual-Graph-Programming

# 2. Install the opt-in git hooks (config validation + board automation)
bash github/hooks/install.sh

# 3. Set up the environments you need
uv sync --all-extras     # Python backend + tooling
npm install              # TypeScript workspaces (extension/ + app/)
pixi install             # C++ toolchain for base/
cargo build              # Rust workspace (app/src-tauri)
```

See the [README](../README.md#-installation--setup) for full prerequisite
details per platform.

## Repository Structure

| Path | Module | Language / Env file |
| --- | --- | --- |
| `base/` | Core parsing & graph engine | C++ — `pixi.toml`, `base/CMakeLists.txt` |
| `backend/` | ML / Graph-RAG / MCP sidecar | Python — root `pyproject.toml` |
| `extension/` | VS Code extension | TypeScript — `extension/package.json` |
| `app/` | Tauri standalone app | TypeScript + Rust — `app/package.json`, `app/src-tauri/Cargo.toml` |
| `plugin/` | Unreal Engine plugin | C++ (UE build system) |
| `moon/` | `ROADMAP.md`, `CHANGELOG.md` | — |
| `git/` | This file, `codecov.yaml` | — |
| `github/` | Board automation scripts/hooks | Python |

## Development Workflow

1. **Pick or create an issue.** Work should map to an issue on the
   [project board](https://github.com/users/ACFHarbinger/projects/13/).
2. **Branch from `main`:**
   ```bash
   git checkout -b <type>/<short-description>
   # types: feature/  fix/  docs/  refactor/  test/  chore/
   ```
3. **Keep changes scoped.** One logical change per branch/PR; cross-module
   changes should explain why they must land together.
4. **Update docs alongside code** — including `moon/CHANGELOG.md` under the
   `[Unreleased]` section for user-visible changes.

## Commit Messages & Ticket References

- Use the imperative mood in the subject line ("Add X", not "Added X").
- Keep the subject ≤ 72 characters; add a body when the *why* isn't obvious.
- **Reference the issue you're working on** (e.g. `Refs #42` or `Closes #42`).
  The opt-in `post-commit` hook parses ticket references (patterns configured
  in `github/config/automation_rules.yaml`) and transitions the corresponding
  card on the project board automatically when `GITHUB_TOKEN` and
  `VGP_PROJECT_ID` are set.

## Coding Standards

### C++ (`base/`, `plugin/`)

- C++20, warnings-as-errors in CI (`-Wall -Wextra`).
- Format with `clang-format` (LLVM style, config at `base/.clang-format`).
- No raw owning pointers — use RAII / smart pointers.
- Public APIs documented with Doxygen comments.

### Python (`backend/`, `github/scripts/`)

- Lint/format with **Ruff** (`uv run ruff check . && uv run ruff format .`).
- Type-check with **MyPy** (`uv run mypy backend`); new code must be fully
  type-hinted.
- Docstrings in Google style.

### TypeScript (`extension/`, `app/`)

- Strict mode (`"strict": true`) — no `any` without justification.
- Lint with ESLint, format with Prettier (`npm run lint`, `npm run format`).
- React components: function components + hooks only.

### Rust (`app/src-tauri/`)

- `cargo fmt` and `cargo clippy -- -D warnings` must pass.
- Avoid `unwrap()`/`expect()` outside tests; propagate errors with `Result`.

## Testing Requirements

Every PR must keep the suite green and should add tests for new behavior:

```bash
npm test                 # extension + app (Vitest)
uv run pytest            # Python backend
pixi run test            # C++ (GoogleTest via CTest)
cargo test               # Rust
```

- Coverage is uploaded to Codecov with per-module flags
  (see [`git/codecov.yaml`](codecov.yaml)). Patch coverage target: **70%**.
- Bug fixes must include a regression test that fails without the fix.

## Pull Request Process

1. Rebase on the latest `main` before opening the PR.
2. Fill in the PR template (`.github/PULL_REQUEST_TEMPLATE.md`) — including
   the linked issue and a test plan.
3. Ensure CI is green: build, lint, type-check, tests, coverage.
4. One approving review is required before merge.
5. Squash-merge is preferred; the squashed message must keep the ticket
   reference.

## Project Board & Automation

The backlog is synchronized between `moon/ROADMAP.md` and the GitHub
ProjectV2 board by `github/scripts/sync_backlog.py` (run via the
`agent_sync` workflow). If you change roadmap milestones, expect the board
to be diffed/updated on the next sync. Label taxonomy lives in
`github/config/project_labels.json` — use those labels rather than inventing
new ones.

---

Questions? Open a [discussion issue](https://github.com/ACFHarbinger/Visual-Graph-Programming/issues)
or ask on the project board. Happy hacking!
