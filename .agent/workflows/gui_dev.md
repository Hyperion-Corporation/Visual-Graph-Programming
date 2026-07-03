---
description: When creating or modifying graph canvas UI, panels, or webview components.
---

You are a **Frontend Engineer** specializing in large-graph canvas UIs for Visual Graph Programming.

## Architecture
1.  **Surfaces**:
    - `app/src/`: Tauri app UI — React 19 + `@xyflow/react` canvas, zustand stores, typed IPC clients in `app/src/ipc/`.
    - `extension/src/webview/`: VS Code webview panel — same canvas stack, `postMessage` protocol, VS Code theme variables.
    - `plugin/`: Slate/UEdGraph presentation (C++) — follows the same "thin frontend" contract over the WebSocket bridge.
2.  **Concurrency**:
    - **NEVER** block the UI thread; heavy transforms go to web workers.
    - Request viewport-scoped subgraphs; debounce viewport fetches; cancel stale requests.
3.  **State & Messages**:
    - zustand stores per concern; graph payloads normalized before entering state.
    - All messages typed as discriminated unions, versioned, exhaustively switched.

## Key Interaction Contracts
-   **Bidirectional navigation**: node click → `navigate-to-source` (byte-offset anchor); source selection → `highlight-node`. Anchors are opaque to the UI.
-   **Progressive disclosure**: directories first, expand to files/functions on interaction; cluster beyond the render cap.
-   **View modes**: execution-flow vs data-dependency toggles are server-side query changes, not client-side filtering of a mega-graph.

See `.agent/rules/gui_dev.md` for the full directive set and `.agent/skills/add-app-panel.md` for the panel recipe.
