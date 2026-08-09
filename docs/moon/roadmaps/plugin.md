# Plugin Module Roadmap — Unreal Engine

Detail for Track C — see [`../ROADMAP.md`](../ROADMAP.md)'s Track C for the
checklist as tracked on the board.
*Board view: [views/6](https://github.com/users/ACFHarbinger/projects/13/views/6).*

`plugin/` brings VGP's bidirectional graph ⇄ text model into the Unreal
Editor: a `UEdGraph`/Slate visual scripting interface over native C++ (and
eventually Verse), aiming to replace binary Blueprints with text-as-source-
of-truth graphs.

## Milestone C — Unreal Engine Plugin

- [ ] **C1** Scaffold the UE plugin: `.uplugin` descriptor, editor module, build rules, and CI compile checks against a pinned engine version.
- [ ] **C2** Integrate the base core library (DLL) with a WebSocket bridge so graph queries never block the engine tick thread.
- [ ] **C3** Implement custom `UEdGraph`/`UEdGraphNode` classes representing C++ constructs (declarations, calls, branches, UE macros).
- [ ] **C4** Implement Slate presentation: `SGraphEditor` asset editor tab, `SGraphNode` subclasses styled after the Blueprint editor.
- [ ] **C5** Implement `UEdGraphSchema` type-checked pin validation and reflection-driven context-menu actions (functions, variables, macros).
- [ ] **C6** Integrate `tree-sitter-unreal-cpp` so UCLASS/UPROPERTY/UFUNCTION macros parse as first-class AST nodes (no destructive expansion).
- [ ] **C7** Round-trip engineering: lossless text→graph parsing and graph→text splicing via `tree.edit()` byte-range insertion, preserving comments/whitespace.
- [ ] **C8** Live Coding integration: patch `.cpp`-only edits at runtime; detect header/memory-layout changes and gate them behind an explicit "Commit to Native" rebuild flow.
- [ ] **C9** Asset-registry ingestion: visualize asset dependency graphs (materials, meshes, levels) with blast-radius queries for artists.
- [ ] **C10** Read-only logic-flow graphs for designers: state machines, behavior trees, and dialogue data with dead-end/unreachable-state detection.
- [ ] **C11** Verse syntax-to-node translation prototype: read-only Blueprint-style visual graphs generated from text-based Verse code.

## Notes

- C7 (round-trip engineering) is the hardest invariant in this track —
  comment/whitespace-preserving splicing is what makes the graph a real
  projection of text rather than a lossy summary of it.
- C8's Live Coding gate exists because header/layout changes can't be
  hot-patched safely — don't relax it to "just try it and see."
