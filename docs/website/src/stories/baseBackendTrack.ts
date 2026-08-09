import type { RoadmapStory } from '../interfaces/types';

export const BASE_BACKEND_TRACK: RoadmapStory = {
  id: 'base-backend-track',
  title: 'Track A — Base + Backend Modules',
  track: 'Track A',
  summary:
    'The C++20 parsing/graph core (base/) and the Python Graph-RAG/OR-layout sidecar (backend/) stabilize ' +
    'before any host wrapper is built on top of them — Tree-sitter parsing into a GrafeoDB-backed code ' +
    'property graph, exposed through a stable C API and WebSocket/IPC server.',
  tags: ['core', 'graph-engine', 'grafeo'],
  docPath: '/repo/docs/moon/roadmaps/base',
};
