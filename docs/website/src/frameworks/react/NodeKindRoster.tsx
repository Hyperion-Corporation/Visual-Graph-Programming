import { useMemo, useState } from "react";
import { GRAPH_ENTITY_ROSTER, MODULES } from "../../constants/graphSchema";
import type { ModuleId, NodeCategory } from "../../interfaces/types";
import "./NodeKindRoster.css";

/**
 * Live filterable browser over VGP's illustrative graph-entity roster
 * (src/constants/graphSchema.ts) — the same data src/stories/ and the
 * design docs draw from. Native React shell component (mounted directly in
 * HomeView.tsx); Storybook (../../../stories/) documents it in isolation.
 */
const CATEGORIES: Array<{ id: NodeCategory | "all"; label: string; icon: string }> = [
  { id: "all", label: "All kinds", icon: "🗺️" },
  { id: "file", label: "File", icon: "📄" },
  { id: "class", label: "Class", icon: "🧩" },
  { id: "function", label: "Function", icon: "ƒ" },
];

export function NodeKindRoster() {
  const [category, setCategory] = useState<NodeCategory | "all">("all");
  const [module, setModule] = useState<ModuleId | "all">("all");

  const filtered = useMemo(
    () =>
      GRAPH_ENTITY_ROSTER.filter((n) => (category === "all" ? true : n.category === category)).filter((n) =>
        module === "all" ? true : n.module === module
      ),
    [category, module]
  );

  return (
    <div className="node-kind-roster">
      <div className="nkr-filters">
        <div className="nkr-filter-group" role="group" aria-label="Filter by node category">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`nkr-chip${category === c.id ? " active" : ""}`}
              onClick={() => setCategory(c.id)}
            >
              <span aria-hidden="true">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
        <div className="nkr-filter-group" role="group" aria-label="Filter by module">
          {(["all", ...MODULES] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`nkr-chip${module === m ? " active" : ""}`}
              onClick={() => setModule(m)}
            >
              {m === "all" ? "All modules" : m}
            </button>
          ))}
        </div>
      </div>

      <ul className="nkr-list">
        {filtered.map((n) => (
          <li key={n.id} className="nkr-row">
            <span className="nkr-name">{n.name}</span>
            <span className={`nkr-badge nkr-badge-${n.category}`}>{n.category}</span>
            <span className="nkr-module">{n.module}</span>
          </li>
        ))}
        {filtered.length === 0 && <li className="nkr-empty">No entities match this filter.</li>}
      </ul>
    </div>
  );
}

export default NodeKindRoster;
