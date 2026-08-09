import type { GraphEntityRosterEntry, ModuleId } from '../interfaces/types';

/** Every module VGP's roadmap tracks, for docs/hub filter chips. */
export const MODULES: ModuleId[] = ['base', 'backend', 'extension', 'app', 'plugin'];

/** Illustrative graph-entity roster for docs / hub (not a live schema dump). */
export const GRAPH_ENTITY_ROSTER: GraphEntityRosterEntry[] = [
  { id: 'base_ingest_file', name: 'base/src/graph/ingest.cpp', module: 'base', category: 'file' },
  { id: 'base_parser_class', name: 'class IncrementalParser', module: 'base', category: 'class' },
  { id: 'base_parse_fn', name: 'parse_subtree()', module: 'base', category: 'function' },
  { id: 'backend_retrieval_file', name: 'backend/graph_rag/retrieval.py', module: 'backend', category: 'file' },
  { id: 'backend_layout_class', name: 'class StressMajorizationLayout', module: 'backend', category: 'class' },
  { id: 'backend_rrf_fn', name: 'reciprocal_rank_fusion()', module: 'backend', category: 'function' },
  { id: 'extension_panel_file', name: 'extension/src/webview/graphPanel.ts', module: 'extension', category: 'file' },
  { id: 'extension_panel_class', name: 'class GraphWebviewPanel', module: 'extension', category: 'class' },
  { id: 'app_core_file', name: 'app/src-tauri/src/sidecar.rs', module: 'app', category: 'file' },
  { id: 'app_sidecar_fn', name: 'spawn_sidecar()', module: 'app', category: 'function' },
  { id: 'plugin_graph_class', name: 'class UVgpEdGraph', module: 'plugin', category: 'class' },
];

/** Setting window used across roadmap docs and stories. */
export const ROADMAP_WINDOW = {
  label: 'Core-first: base/backend before host wrappers',
  startTrack: 'A',
  endTrack: 'D',
} as const;
