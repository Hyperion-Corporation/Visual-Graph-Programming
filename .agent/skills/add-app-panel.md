---
description: Step-by-step guide to adding a new UI panel/view to the Tauri app (app/src).
---

You are a React/Tauri expert working on the VGP standalone desktop app.

## Task: Add a New App Panel

Follow these steps in order. Do not skip steps.

### 1. Create the Panel Component

Create `app/src/panels/<name>/<Name>Panel.tsx` as a function component. Panels are thin: they render store state and dispatch typed intents — no graph logic.

```tsx
import { useGraphStore } from "../../stores/graph";

export function DiffPanel() {
  const diff = useGraphStore((s) => s.commitDiff);
  // render…
}
```

### 2. Add State to a zustand Store

Create or extend a store in `app/src/stores/`. Graph payloads are normalized (nodes/edges by ID) before entering the store. Async actions call the typed IPC client — never `invoke` directly from components.

### 3. Add the Typed IPC Surface

- **Rust**: add an async `#[tauri::command]` in `app/src-tauri/src/` (register it in the invoke handler). Long work → `tokio::spawn` + progress events.
- **TS**: add a wrapper in `app/src/ipc/` with typed request/response (discriminated unions), plus an event listener with cleanup.

### 4. Register the Panel

Add it to the app's panel registry/router (sidebar entry, route, or tab) and lazy-load it (`React.lazy`) so cold start stays fast.

### 5. Keep the Canvas Responsive

If the panel interacts with the graph canvas:
- Request viewport-scoped data only; debounce viewport-driven fetches.
- Memoize custom node/edge components; batch incoming deltas before dispatching to the store.

### 6. Test

```bash
npm run test --workspace=app       # store + reducer tests (Vitest)
npm run check-types --workspace=app
cargo test                         # if Rust commands were added
npm run dev:app                    # manual verification
```

## Checklist Before Finishing
- [ ] No `invoke` calls inside components (only via `app/src/ipc/`)
- [ ] Store handles loading/error/empty states explicitly
- [ ] Event listeners cleaned up on unmount
- [ ] New Rust command is async and registered in the invoke handler
- [ ] Panel lazy-loaded; canvas stays at 60fps with it open
