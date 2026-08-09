import type { RoadmapStory } from '../interfaces/types';

export const PLUGIN_TRACK: RoadmapStory = {
  id: 'plugin-track',
  title: 'Track C — Unreal Engine Plugin',
  track: 'Track C',
  summary:
    'A bidirectional, node-based visual scripting interface over native C++ (and eventually Verse) inside the ' +
    'Unreal Editor, aiming to replace binary Blueprints with text-as-source-of-truth graphs — lossless round-trip ' +
    'parsing/splicing and Live Coding integration are the hardest invariants on this track.',
  tags: ['plugin', 'unreal-engine', 'graph-engine'],
  docPath: '/repo/docs/moon/roadmaps/plugin',
};
