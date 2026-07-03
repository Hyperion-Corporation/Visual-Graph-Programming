# Documentation Update Prompt

**Intent:** Ensure documentation remains accurate after code changes.

## The Prompt

I have modified the following files: `[INSERT FILE LIST]`.

Please update the relevant documentation to reflect these changes:
1. **`.agent/AGENTS.md`**: If architectural boundaries, module responsibilities, or governance rules changed.
2. **`README.md`**: If new dependencies, setup steps, or commands are needed.
3. **`moon/CHANGELOG.md`**: Add user-visible changes under the `[Unreleased]` section (Keep a Changelog format).
4. **`moon/ROADMAP.md`**: Tick or amend the implementation steps this change advances (the project board syncs from this file).
5. **Docstrings/comments**: Google-style docstrings for Python, Doxygen for C++ public APIs, TSDoc for exported TypeScript, `///` for public Rust items.

Verify whether any dependency manifest changed and note the required sync command:
- `pyproject.toml` → `uv sync --all-extras`
- `extension/package.json` or `app/package.json` → `npm install` (repo root)
- `Cargo.toml` / `app/src-tauri/Cargo.toml` → `cargo build`
- `pixi.toml` / `base/CMakeLists.txt` → `pixi install && pixi run configure`
