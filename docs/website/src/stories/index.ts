import type { RoadmapStory } from '../interfaces/types';
import { BASE_BACKEND_TRACK } from './baseBackendTrack';
import { EXTENSION_APP_TRACK } from './extensionAppTrack';
import { PLUGIN_TRACK } from './pluginTrack';

/** Catalog of roadmap-track summaries for the docs site / design hub. */
export const ROADMAP_STORIES: RoadmapStory[] = [BASE_BACKEND_TRACK, EXTENSION_APP_TRACK, PLUGIN_TRACK];

export function getRoadmapStory(id: string): RoadmapStory | undefined {
  return ROADMAP_STORIES.find((s) => s.id === id);
}

export { BASE_BACKEND_TRACK, EXTENSION_APP_TRACK, PLUGIN_TRACK };
