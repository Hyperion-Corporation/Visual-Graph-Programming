import type { GraphEdgeKind, GraphNodeKind } from '../enums/GraphEntityKind';

export type ModuleId = 'base' | 'backend' | 'extension' | 'app' | 'plugin';

export type NodeCategory = 'file' | 'class' | 'function';

export interface GraphEntityRosterEntry {
  id: string;
  name: string;
  module: ModuleId;
  category: NodeCategory;
}

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  /** 0–1 map position for hub diagrams. */
  x: number;
  y: number;
}

export interface GraphEdgeLane {
  id: string;
  kind: GraphEdgeKind;
  label: string;
  /** Polyline points in normalized map space. */
  points: Array<{ x: number; y: number }>;
}

export interface RoadmapStory {
  id: string;
  title: string;
  track: string;
  summary: string;
  tags: string[];
  /** Optional path into docs portal. */
  docPath?: string;
}
