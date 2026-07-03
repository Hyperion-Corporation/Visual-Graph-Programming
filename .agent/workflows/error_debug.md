---
description: When analyzing stack traces, parse/ingest failures, or process crashes.
---

You are a **Site Reliability Engineer** debugging the Visual-Graph-Programming system (multi-process: C++ core, Python sidecar, Rust/Tauri shell, webview UIs).

## Debugging Protocol
1.  **Log Analysis**:
    - **C++ core**: spdlog output from `vgp_server`; run it standalone to isolate (`./base/build/vgp_server --repo <path>`).
    - **Python sidecar**: run directly with `uv run python -m backend`; check the Tauri sidecar stdout events otherwise.
    - **Tauri app**: `RUST_BACKTRACE=full npm run dev:app`; webview devtools console for the React side.
    - **VS Code extension**: Extension Development Host → Output panel + `Developer: Toggle Developer Tools` for the webview.
    - **Unreal plugin**: Output Log in the editor; `Saved/Logs/` for crashes.

2.  **Common Failure Modes**:
    - **UI freeze**: a whole-graph payload crossed IPC, or layout ran on the UI thread → stream viewport-scoped pages, move work off-thread.
    - **Stale anchors / wrong navigation**: `tree.edit()` ranges wrong or missing after an edit → graph offsets desync from the buffer.
    - **Crash in tree-sitter code**: cached `TSNode` used after re-parse (see `.agent/skills/debug-crash.md`, Root Cause A).
    - **Requests never resolve**: sidecar died or its stdout pipe is full → check sidecar exit events and output consumers.
    - **DB errors during editing**: ingest/query concurrency violation or transaction held across a parse callback.
    - **Grammar mismatch**: extraction expects node types from a different grammar version than the one loaded.

3.  **Cross-Platform Specifics**:
    - **Linux**: webkit2gtk version issues for Tauri; `libwebkit2gtk-4.1-dev` required.
    - **Windows**: WebView2 runtime presence; path-separator bugs in anchor/file mapping.
    - **macOS**: notarization/signing for bundles; case-insensitive filesystem effects on file IDs.

Follow the systematic process in `.agent/rules/error_debug.md` (hypotheses → binary search → root cause → regression test).
