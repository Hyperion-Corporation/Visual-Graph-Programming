# Extension Module Roadmap — VS Code

Detail for Track B — see [`../ROADMAP.md`](../ROADMAP.md)'s Track B for the
checklist as tracked on the board.
*Board view: [views/2](https://github.com/users/ACFHarbinger/projects/13/views/2).*

`extension/` is the in-editor surface: a webview graph panel over `base/`'s
graph service, with LSP-backed call-hierarchy navigation and bidirectional
sync back to the text editor.

## Milestone B — VS Code Extension

- [ ] **B1** Scaffold the VS Code extension: `extension/package.json` manifest, esbuild bundling, Vitest harness, activation events and commands.
- [ ] **B2** Integrate Tree-sitter (WASM) in the extension host for local, error-tolerant AST extraction without a compilable project state.
- [ ] **B3** Implement the webview graph panel: React Flow rendering, VS Code theme-variable integration, strict CSP and message-passing protocol.
- [ ] **B4** Connect to the base module's graph service and implement sub-graph streaming/pagination to avoid IPC serialization stalls.
- [ ] **B5** Implement bidirectional call-graph views via the LSP Call Hierarchy API (incoming/outgoing traversal to a configurable depth).
- [ ] **B6** Bidirectional navigation: node click → `showTextDocument` at exact line; editor selection → highlight corresponding node.
- [ ] **B7** Semantic filtering and progressive disclosure: hide generated/test/vendor files, expand directories into functions on interaction.
- [ ] **B8** Path extraction and export: isolate root→target execution paths and export refined graphs to Mermaid/PlantUML.
- [ ] **B9** Persist webview state (`retainContextWhenHidden` + host-side serialization) and profile large-graph performance.
- [ ] **B10** Package and publish to the VS Code Marketplace with CI-driven release automation.

## Notes

- B3's message-passing protocol between the extension host and the webview
  is the same shape `app/`'s Rust↔React IPC will need to solve later —
  design it once, reuse the pattern.
- B6 (bidirectional navigation) is the extension's core value proposition;
  don't let later milestones erode it in the name of a feature.
