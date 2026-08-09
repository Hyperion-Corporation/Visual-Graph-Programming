import { GraphNodeKind, GraphEdgeKind } from "../../enums/GraphEntityKind";
import { ROADMAP_STORIES } from "../../stories";
import type { RoadmapStory, GraphNode, GraphEdgeLane } from "../../interfaces/types";

/**
 * Illustrative code-property-graph layout backing the Apollo/GraphQL
 * island — a small File/Class/Function node set with Call/Import edges,
 * laid out on the 0–1 map space `GraphNode`/`GraphEdgeLane` use elsewhere
 * in this site.
 */
export const GRAPH_NODES: GraphNode[] = [
  { id: "root", kind: GraphNodeKind.File, label: "base/src/graph/ingest.cpp", x: 0.5, y: 0.5 },
  { id: "class-parser", kind: GraphNodeKind.Class, label: "IncrementalParser", x: 0.42, y: 0.18 },
  { id: "class-ingest", kind: GraphNodeKind.Class, label: "GraphIngestor", x: 0.68, y: 0.42 },
  { id: "fn-parse", kind: GraphNodeKind.Function, label: "parse_subtree()", x: 0.14, y: 0.55 },
  { id: "fn-upsert", kind: GraphNodeKind.Function, label: "upsert_batch()", x: 0.22, y: 0.82 },
];

export const GRAPH_EDGE_LANES: GraphEdgeLane[] = [
  {
    id: "call-parse",
    kind: GraphEdgeKind.Call,
    label: "IncrementalParser calls parse_subtree()",
    points: [
      { x: 0.05, y: 0.1 },
      { x: 0.3, y: 0.28 },
      { x: 0.5, y: 0.5 },
    ],
  },
  {
    id: "import-ingest",
    kind: GraphEdgeKind.Import,
    label: "GraphIngestor imports upsert_batch()",
    points: [
      { x: 0.02, y: 0.6 },
      { x: 0.2, y: 0.55 },
      { x: 0.5, y: 0.5 },
    ],
  },
  {
    id: "import-root",
    kind: GraphEdgeKind.Import,
    label: "ingest.cpp imports GraphIngestor",
    points: [
      { x: 0.1, y: 0.9 },
      { x: 0.3, y: 0.7 },
      { x: 0.5, y: 0.5 },
    ],
  },
];

export function getGraphNodes(): GraphNode[] {
  return GRAPH_NODES;
}

export function getGraphEdgeLanes(): GraphEdgeLane[] {
  return GRAPH_EDGE_LANES;
}

export function getRoadmapStories(): RoadmapStory[] {
  return ROADMAP_STORIES;
}

export function getRoadmapStoryById(id: string): RoadmapStory | null {
  return ROADMAP_STORIES.find((s) => s.id === id) ?? null;
}
