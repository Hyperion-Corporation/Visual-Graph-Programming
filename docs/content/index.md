# Visual Graph Programming

**A multi-platform codebase visualization and visual programming tool** —
seamlessly transition between traditional text-based views and interactive
graph-based views (and back) while you program.

VGP parses source code with **Tree-sitter** into a **code property graph**
stored in embedded **GrafeoDB** (graph + vectors in one store), renders it
with **OR-optimized layouts**, and keeps graph and text **bidirectionally
synchronized** through lossless byte-offset anchors.

## Documentation Map

| Section | What you'll find |
| --- | --- |
| [Architecture](architecture.md) | System overview, module boundaries, invariants |
| [C++ Base Core](modules/base.md) | Parsing/graph engine — narrative + Doxygen API |
| [Python Backend](modules/backend.md) | Graph-RAG, layouts, MCP — narrative + Sphinx API |
| [VS Code Extension](modules/extension.md) | Editor integration — narrative + TypeDoc API |
| [Tauri App](modules/app.md) | Standalone desktop app — narrative + TypeDoc/rustdoc API |
| [Unreal Engine Plugin](modules/plugin.md) | Engine integration — narrative + Doxygen API |
| [Building the Docs](building.md) | How this site and the API references are generated |

## Quick Links

- [Repository README](https://github.com/ACFHarbinger/Visual-Graph-Programming#readme)
- [Roadmap](https://github.com/ACFHarbinger/Visual-Graph-Programming/blob/main/moon/ROADMAP.md)
  and [Changelog](https://github.com/ACFHarbinger/Visual-Graph-Programming/blob/main/moon/CHANGELOG.md)
- [Project board](https://github.com/users/ACFHarbinger/projects/13/)
- [Contributing guide](https://github.com/ACFHarbinger/Visual-Graph-Programming/blob/main/git/CONTRIBUTING.md)
- Research reports under
  [`prisma/`](https://github.com/ACFHarbinger/Visual-Graph-Programming/tree/main/prisma)
