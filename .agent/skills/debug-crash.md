---
description: Diagnostic checklist for native crashes and hangs (SIGSEGV, SIGABRT, frozen UI) across VGP's C++/Rust/sidecar process tree.
---

You are a systems-level debugger. VGP runs a C++ core (tree-sitter + GrafeoDB), a Rust/Tauri shell, a Python sidecar, and webview UIs across multiple processes. Crashes and hangs cluster into a few root causes.

## Triage: Identify the Failing Process First

```bash
# Which process died? Check the Tauri app's sidecar event log / terminal.
# Core dumps (Linux):
coredumpctl list | tail -5
coredumpctl gdb <pid>          # backtrace of the latest crash
```

---

## Root Cause A — Stale TSNode / Use-After-Edit (most common in `base/`)

**Symptom**: `SIGSEGV` inside tree-sitter functions or when reading node byte ranges after a document edit.

**Cause**: `TSNode`s are invalidated by `ts_tree_edit`/re-parse. Caching nodes (or byte ranges computed from an old tree) across edits is use-after-free by design.

**Fix**: Copy out byte ranges immediately; re-query nodes from the current tree. Document lifetime: nodes never outlive their tree, trees never outlive their document revision.

**Search for violations**:
```bash
grep -rn "TSNode" base/src --include='*.hpp' | grep -iE "member|cache|store"
```

---

## Root Cause B — Cross-Boundary Exceptions (C API / FFI)

**Symptom**: `SIGABRT`/`std::terminate` in the app or plugin when a core call fails; Rust reports the process died mid-`invoke`.

**Cause**: A C++ exception escaped through the `extern "C"` API, or panicked Rust unwound across FFI.

**Fix**: Every C API entry wraps its body in `try/catch(...)` → `vgp_status`; Rust FFI uses `catch_unwind` at the seam. Never let unwinding cross a language boundary.

---

## Root Cause C — Concurrent Ingest vs Query on GrafeoDB

**Symptom**: Crash or corrupted results during live editing while a graph view is open; often intermittent.

**Cause**: Writer (ingest) and reader (query) touching the store without the documented reader/writer discipline, or a transaction held across a parse callback.

**Fix**: All DB access goes through the core's dispatch queues; no transaction spans a parse or network call. Re-run under TSAN: `cmake -DCMAKE_CXX_FLAGS=-fsanitize=thread`.

---

## Root Cause D — Sidecar Death / Pipe Backpressure (Tauri app)

**Symptom**: UI hangs or requests never resolve; no crash in the app itself.

**Cause**: The C++/Python sidecar exited (check its stderr events) or its stdout isn't being consumed, blocking the child on a full pipe.

**Fix**: Always attach stdout/stderr listeners before first write; surface sidecar exit as a UI state with restart; add heartbeat messages to detect silent death.

```bash
# Reproduce standalone:
./base/build/vgp_server --repo <path>   # run the core directly
uv run python -m backend               # run the sidecar directly
```

---

## Root Cause E — Webview Freeze (not a crash)

**Symptom**: Canvas stops responding; process alive.

**Cause**: A huge graph payload was serialized over IPC/postMessage, or layout ran on the UI thread.

**Fix**: Viewport-scoped streaming; move heavy transforms to a web worker; profile with the webview devtools performance tab.

---

## Quick Diagnostic Commands

```bash
# ASAN build of the core (memory errors)
cmake -S base -B base/build-asan -DCMAKE_BUILD_TYPE=Debug -DCMAKE_CXX_FLAGS="-fsanitize=address"
cmake --build base/build-asan && ctest --test-dir base/build-asan

# Rust backtraces
RUST_BACKTRACE=full npm run dev:app

# Check for unconsumed sidecar output handlers
grep -rn "spawn" app/src-tauri/src | grep -v "on_event\|stdout"
```
