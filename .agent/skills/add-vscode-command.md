---
description: Guide for adding a new command (and optional webview interaction) to the VS Code extension.
---

You are a VS Code extension expert working on VGP's `extension/` workspace.

## Task: Add a New Extension Command

### 1. Declare the Command in the Manifest

In `extension/package.json` under `contributes.commands`:

```json
{ "command": "vgp.showBlastRadius", "title": "VGP: Show Blast Radius" }
```

Add menu/keybinding contributions only if the command is context-sensitive (e.g. `editor/context` with a `when` clause on supported languages).

### 2. Implement and Register the Handler

In the activation path (keep activation lazy — import heavy modules inside the handler):

```ts
context.subscriptions.push(
  vscode.commands.registerCommand("vgp.showBlastRadius", async () => {
    const { runBlastRadius } = await import("./commands/blastRadius.js");
    await runBlastRadius(graphClient, panelManager);
  }),
);
```

Rules:
- Handlers are async and never block on the graph service — show `vscode.window.withProgress` for long queries.
- All disposables go into `context.subscriptions`.

### 3. Extend the Webview Protocol (if the command drives the panel)

Add a message pair to `extension/src/protocol.ts` (discriminated union, versioned) and handle it in both the host-side panel manager and the webview reducer. Exhaustive-switch with a `never` check so missed kinds fail the build.

### 4. Talk to the Core, Not the Files

Data comes from the `base/` graph service (WebSocket client) or the LSP (`vscode.commands.executeCommand('vscode.prepareCallHierarchy', …)`) — never re-parse files ad hoc in the handler.

### 5. Test

```bash
npm run test --workspace=extension    # unit tests for the handler logic + reducer
npm run build:extension
# Manual: F5 → Extension Development Host → run the command from the palette.
```

## Checklist
- [ ] Command declared in package.json and registered in code
- [ ] Activation stays lazy (dynamic import of heavy modules)
- [ ] Long operations show progress and are cancellable
- [ ] Protocol messages typed + versioned; reducers exhaustive
- [ ] Disposables tracked in context.subscriptions
