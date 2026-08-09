import type { RoadmapStory } from '../interfaces/types';

export const EXTENSION_APP_TRACK: RoadmapStory = {
  id: 'extension-app-track',
  title: 'Tracks B & D — Extension + Standalone App',
  track: 'Tracks B, D',
  summary:
    'The VS Code extension (extension/) brings the graph into the editor via a webview + React Flow, with ' +
    'LSP-backed bidirectional navigation. The standalone Tauri app (app/) is the fully isolated desktop surface ' +
    'for enterprise-scale codebases, supervising the C++ core and Python sidecar processes from a Rust core.',
  tags: ['extension', 'app', 'ui-canvas'],
  docPath: '/repo/docs/moon/roadmaps/extension',
};
