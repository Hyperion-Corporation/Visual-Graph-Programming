---
description: Guide for adding a new Tauri command to the Rust core (app/src-tauri) with its typed TypeScript client.
---

You are a Rust/Tauri expert working on the VGP standalone app's Rust core.

## Task: Add a New Tauri Command

### 1. Implement the Command (Rust)

In the owning module under `app/src-tauri/src/` (e.g. `commands/repo.rs`):

```rust
#[derive(serde::Deserialize)]
pub struct OpenRepoArgs { pub path: String }

#[derive(serde::Serialize, Clone)]
pub struct RepoInfo { pub root: String, pub file_count: u64 }

#[tauri::command]
pub async fn open_repository(
    args: OpenRepoArgs,
    state: tauri::State<'_, AppState>,
    app: tauri::AppHandle,
) -> Result<RepoInfo, CommandError> {
    let root = validate_repo_path(&args.path)?;   // webview input is untrusted
    let engine = state.engine.clone();
    let info = engine.open(root).await?;           // never block the IPC thread
    app.emit("repo:opened", &info)?;               // progress/updates via events
    Ok(info)
}
```

Rules:
- Commands are `async`; long work goes through `tokio::spawn` with progress **events**, the command returns quickly.
- Errors are a `thiserror` enum implementing `serde::Serialize` — no `unwrap()`.
- Validate every path/URL from the webview.

### 2. Register It

Add to the `invoke_handler` in `app/src-tauri/src/lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![commands::repo::open_repository, /* … */])
```

### 3. Add the Typed TS Client

In `app/src/ipc/repo.ts` — components never call `invoke` directly:

```ts
export interface RepoInfo { root: string; fileCount: number }

export async function openRepository(path: string): Promise<Result<RepoInfo, IpcError>> {
  try {
    return ok(await invoke<RepoInfo>("open_repository", { args: { path } }));
  } catch (e) {
    return err(parseIpcError(e));
  }
}

export function onRepoOpened(cb: (info: RepoInfo) => void): () => void {
  const un = listen<RepoInfo>("repo:opened", (e) => cb(e.payload));
  return () => { un.then((f) => f()); };
}
```

### 4. Test

```bash
cargo test                          # command logic behind a trait, no Tauri runtime needed
cargo clippy -- -D warnings
npm run test --workspace=app        # TS client + store integration (mock @tauri-apps/api)
npm run dev:app                     # manual end-to-end
```

## Checklist
- [ ] Command async, registered in the invoke handler
- [ ] Serializable error enum; no unwrap/expect
- [ ] Webview inputs validated before use
- [ ] Long work → spawned task + events, not a blocking return
- [ ] Typed TS wrapper in app/src/ipc/ with event cleanup
