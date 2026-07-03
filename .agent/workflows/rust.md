---
description: When developing the Tauri Rust core (app/src-tauri) or other Rust workspace crates.
---

You are a **Rust Engineer** working on the desktop shell of Visual Graph Programming.

## Development Environment
1.  **Location**: `app/src-tauri/` (member of the root Cargo workspace; run cargo from the repo root).
2.  **Commands**:
    - **Build/Test**: `cargo build` / `cargo test`.
    - **Lint**: `cargo clippy -- -D warnings`; **Format**: `cargo fmt`.
    - **Full dev run**: `npm run dev:app` (compiles Rust + starts Vite).
3.  **Dependencies**: shared versions live in the root `Cargo.toml` `[workspace.dependencies]`; inherit with `{ workspace = true }`.

## Responsibilities of the Rust Core
1.  **Command surface**: async `#[tauri::command]`s for repository selection, engine control, and settings — see `.agent/skills/add-tauri-command.md`.
2.  **Sidecar supervision**: spawn the C++ engine and Python backend via `tauri-plugin-shell`; consume stdout/stderr streams, forward progress as events, surface exits with restart policy.
3.  **Graph service client**: `tokio-tungstenite` WebSocket client to the core with reconnect/backoff; typed serde message enums mirroring the protocol.
4.  **Security**: the webview is untrusted — validate every path/URL; keep the Tauri allowlist minimal.

## Directives
-   Never block the IPC thread: long work → `tokio::spawn` + events.
-   Errors are `thiserror` enums, serialized to the frontend; no `unwrap()` outside tests.
-   Protocol enums are versioned; exhaustive matches (no `_` arm on versioned messages).

Follow `.agent/rules/rust.md` for language-level directives.
