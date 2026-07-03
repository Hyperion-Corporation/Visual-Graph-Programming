# CLI Generation Prompt

**Intent:** Quickly generate valid build/run/test commands using a Zero-Shot pattern.

## The Prompt

Based on the `README.md` and `.agent/AGENTS.md` instructions, generate the exact CLI command(s) to:
1. **Target module**: [base (C++) / backend (Python) / extension (VS Code) / app (Tauri) / all].
2. **Action**: [configure / build / test / lint / run dev / package].
3. **Variant**: [debug / release].

Remember the per-module toolchains:
- `base/` → pixi tasks (`pixi run configure|build|test`) wrapping CMake/CTest.
- `backend/` → uv (`uv sync --all-extras`, `uv run pytest`, `uv run ruff check .`, `uv run mypy backend`).
- `extension/` + `app/` → npm workspaces from the repo root (`npm run build:extension`, `npm run dev:app`, `npm test`).
- `app/src-tauri/` and future Rust crates → Cargo workspace from the repo root (`cargo build`, `cargo test`, `cargo clippy`).

Output only the bash command(s).
