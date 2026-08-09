# Changelog

All notable changes to Visual Graph Programming are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
`github/scripts/sync_backlog.py` reads this file (together with
[`ROADMAP.md`](ROADMAP.md)) when reconciling the project board.

## [Unreleased]

### Added

- Documentation toolchain under `docs/`: per-module API references — Sphinx
  (backend), Doxygen (base, plugin), TypeDoc (extension, app), rustdoc
  (Tauri core) — unified by a MkDocs Material site, with a tolerant
  one-command orchestrator (`docs/build_docs.sh` / `npm run docs`).

### Changed

- Minimum Python raised to 3.12 (required by the `grafeo` GrafeoDB bindings).

- Project README with index, introduction, tech-stack badges, core-capability
  enumeration, and setup/run/test instructions.
- `git/codecov.yaml` with per-module coverage flags (base, backend, extension,
  app, plugin) and `git/CONTRIBUTING.md` contribution guide.
- `moon/ROADMAP.md` with per-track implementation steps (Base + Backend,
  IDE extension, Unreal Engine plugin, Tauri app) and this changelog.
- Dependency/environment scaffolding for every module: `pixi.toml` +
  `base/CMakeLists.txt` (C++ core), backend dependencies in `pyproject.toml`
  (Python), `extension/package.json` (VS Code extension), `app/package.json` +
  `app/src-tauri/Cargo.toml` (Tauri app), plus root `package.json`
  (npm workspaces) and root `Cargo.toml` (Cargo workspace) orchestrators.

## [0.1.0] — 2026-07-01

### Added

- Initial repository: license, `pyproject.toml` with `ci` optional
  dependencies, `.gitignore`/`.gitattributes`.
- Research reports under `prisma/` covering the architectural roadmap and
  tech stack, VS Code + Unreal Engine plugin development paradigms, and
  codebase visualization/observability tooling.
- GitHub automation suite under `github/` (backlog sync script, LLM agent
  tools, commit-reference checker, opt-in git hooks, label taxonomy and
  automation rules) with the `agent_sync` workflow, issue/PR templates, and
  Dependabot configuration under `.github/`.

[Unreleased]: https://github.com/ACFHarbinger/Visual-Graph-Programming/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ACFHarbinger/Visual-Graph-Programming/releases/tag/v0.1.0
