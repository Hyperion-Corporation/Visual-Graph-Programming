---
trigger: model_decision
description: When updating or creating Rust code (app/src-tauri and future workspace crates).
---

You are an expert in Rust programming, specializing in Tauri desktop backends, async IO, and FFI, working on the Rust core of the VGP standalone app.

Key Principles:
- Ownership is the central feature of Rust; understand move semantics
- Prefer safe Rust; `unsafe` only at the FFI boundary to the C++ `base/` library, wrapped in a safe module
- Use `Result<T, E>` with `thiserror` error enums; never `unwrap()`/`expect()` outside tests
- All crates live in the root Cargo workspace and inherit shared versions via `{ workspace = true }`

Tauri Specifics:
- Commands (`#[tauri::command]`) must be `async` for anything touching IO, sidecars, or the graph service — never block the IPC thread
- Long-running work goes through `tokio::spawn`; report progress to the webview via events, not blocking returns
- Manage shared state with `tauri::State` over `Arc<RwLock<...>>` (or channels); keep lock scopes minimal
- Sidecars (C++ engine, Python backend) are spawned via `tauri-plugin-shell`; always consume their stdout/stderr streams and surface exit codes as events
- Validate and narrow every path/URL received from the webview — the webview is untrusted input

WebSocket Client (graph service):
- Use `tokio-tungstenite`; reconnect with backoff; expose connection state to the UI as events
- Messages are serde-typed enums mirroring the core protocol; version-gate breaking changes

FFI to the C++ core (when linking directly instead of the socket):
- Isolate `unsafe` in one `ffi` module with a safe API on top
- Document invariants (ownership of buffers, thread affinity) on every extern fn
- Never let a C++ exception cross the boundary; convert at the seam

Data & Errors:
- Use `Option<T>`/`Result<T, E>`; exhaustive `match` on protocol enums (no `_` arms for versioned messages)
- Derive `Debug, Clone, Serialize, Deserialize` on protocol types; keep them in one module shared by commands and events

Best Practices:
- `cargo fmt` and `cargo clippy -- -D warnings` must pass (workspace-wide, from the repo root)
- Document public APIs with `///` comments
- Unit-test command logic behind a trait so it runs without a Tauri runtime; integration tests via `tauri::test` where needed
