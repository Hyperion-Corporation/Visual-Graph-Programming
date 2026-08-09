# Pull Request

## Summary

<!-- What does this PR change and why? Link the roadmap item (moon/ROADMAP.md) or issue it closes. -->

## Affected Area(s)

- [ ] `component:graph-engine` — core node/edge graph model, layout, traversal (`base/`, `backend/`)
- [ ] `component:text-sync` — bidirectional text <-> graph synchronization (`base/`)
- [ ] `component:ui-canvas` — interactive canvas rendering / editor UX (`extension/`, `app/`)
- [ ] `component:lsp-bridge` — Language Server Protocol integration (`extension/`)
- [ ] `component:cli` — command-line tooling and dev scripts
- [ ] `component:ci-automation` — CI, bots, repo automation (`.forgejo/`, `github/`)
- [ ] `component:docs` — documentation

## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] ♻️ Refactor
- [ ] ⚡ Performance
- [ ] 📚 Documentation
- [ ] 🔧 Tooling / CI

## Verification

- [ ] `pixi run test` passes (C++ base changes).
- [ ] `uv run pytest` passes (Python backend changes).
- [ ] `npm test` passes (extension/ or app/ changes).
- [ ] `cargo test` passes (app/src-tauri changes).
- [ ] No synchronous blocking on webview UI threads, the VS Code extension host, or the Unreal tick thread — see `.agent/AGENTS.md`'s non-negotiable invariants.
- [ ] If this changes the C API, WebSocket protocol, or graph schema (CRITICAL severity), all consumers (extension TS types, Rust enums, plugin) are updated in this same PR.
- [ ] Docs / roadmap / `moon/CHANGELOG.md` updated where the public surface changed.
