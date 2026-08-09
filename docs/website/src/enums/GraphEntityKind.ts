/** Code property graph node kinds (design-hub / docs entities). */
export enum GraphNodeKind {
  File = 'file',
  Class = 'class',
  Function = 'function',
}

/** Code property graph edge kinds for layout/flow visualizations. */
export enum GraphEdgeKind {
  Call = 'call',
  Import = 'import',
}

/** Docs-site experience quality tiers (mirrors github-pages capability gating). */
export enum ExperienceQuality {
  Static = 'static',
  Reduced = 'reduced',
  Full = 'full',
}
