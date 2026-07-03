---
description: Guide for adding support for a new programming language to the parsing pipeline and graph extractor.
---

You are a parsing-infrastructure expert working on VGP's Tree-sitter pipeline.

## Task: Add a New Language

### 1. Add the Grammar Dependency

- **C++ core**: add a `FetchContent_Declare` for `tree-sitter-<lang>` in `base/CMakeLists.txt` (pin a release tag) and link it where grammars are registered.
- **Python backend** (if it parses directly): add `tree-sitter-<lang>` to `pyproject.toml` dependencies.
- **Extension** (WASM path): add the prebuilt `tree-sitter-<lang>.wasm` to the extension's grammar assets and load it via `web-tree-sitter`.

### 2. Register the Language

Add the language to the core's language registry: file-extension mapping, `TSLanguage*` accessor, and grammar version pin. Node-type names used downstream live in one header: create `base/include/vgp/lang/<lang>_nodes.hpp`.

### 3. Write the Extraction Mapping

Map the grammar's node types to the code property graph schema:
- Definitions → `File`/`Class`/`Function`/`Variable` nodes (with byte-offset anchors).
- References → `CALLS`/`IMPORTS`/`INHERITS`/data-flow edges.
- Handle the language's idioms explicitly (e.g., UE macros for C++ via `tree-sitter-unreal-cpp`, decorators for Python, re-exports for TypeScript).

Use tree-sitter **queries** (`.scm` files under `base/src/lang/<lang>/`) rather than hand-walking the tree where possible — they're testable and versionable.

### 4. Add Fixtures and Tests

- `base/test/fixtures/<lang>/` — small representative source files, including intentionally broken ones (error-tolerance must not crash extraction).
- GoogleTest cases asserting the extracted nodes/edges and their anchors.
- An incremental test: edit a fixture buffer, `ts_tree_edit`, and assert only the touched subtree re-extracts.

### 5. Wire the Frontends

- Extension: add the language to `activationEvents` and the document selector.
- App: extend the language filter UI and file-type icons.

### 6. Verify

```bash
pixi run build && pixi run test
npm run build:extension
```

## Checklist
- [ ] Grammar pinned to a release tag everywhere it's declared
- [ ] Extraction via .scm queries with anchors on every element
- [ ] Broken-code fixture parses without crashing (error tolerance)
- [ ] Incremental re-extraction test passes
- [ ] Extension activation + selector updated
