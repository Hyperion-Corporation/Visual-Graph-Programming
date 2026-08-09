import { useState } from "react";

interface Track {
  title: string;
  timeline: string;
  goals: string[];
  deps: string;
}

const tracks: Record<number, Track> = {
  1: {
    title: "Track A: Base + Backend Modules",
    timeline: "Core-first",
    goals: [
      "Scaffold base/ (C++20, CMake via pixi) and integrate Tree-sitter with an incremental parsing service.",
      "Define the code property graph schema and implement AST → graph extraction with byte-offset anchors.",
      "Embed GrafeoDB, expose a stable C API and WebSocket/IPC server for every frontend to consume.",
    ],
    deps: "No upstream dependency — this track stabilizes before host wrappers are built on it.",
  },
  2: {
    title: "Track B: IDE Extension (VS Code)",
    timeline: "After Track A's C API lands",
    goals: [
      "Scaffold extension/ and integrate Tree-sitter (WASM) for local, error-tolerant AST extraction.",
      "Implement the webview graph panel (React Flow) with sub-graph streaming from base/'s graph service.",
      "Implement bidirectional navigation: node click → source line, editor selection → highlighted node.",
    ],
    deps: "Track A's C API and WebSocket/IPC server.",
  },
  3: {
    title: "Track C: Unreal Engine Plugin",
    timeline: "After Track A's C API lands",
    goals: [
      "Scaffold the UE plugin and integrate the base core library via a WebSocket bridge off the tick thread.",
      "Implement UEdGraph/Slate presentation and tree-sitter-unreal-cpp for UCLASS/UPROPERTY/UFUNCTION macros.",
      "Round-trip engineering: lossless text↔graph splicing via tree.edit(), plus Live Coding integration.",
    ],
    deps: "Track A's C API; independent of Tracks B and D.",
  },
  4: {
    title: "Track D: Standalone Tauri App",
    timeline: "After Tracks A and B/C patterns stabilize",
    goals: [
      "Scaffold app/ (Vite + React 19) and app/src-tauri (Rust core in the root Cargo workspace).",
      "Bundle the C++ base engine and Python backend as supervised sidecars with stdout event streaming.",
      "Implement the main graph canvas, the OR layout service, and a Graph-RAG assistant panel backed by MCP.",
    ],
    deps: "Track A's C API/WebSocket protocol; Track A2's MCP server for the assistant panel.",
  },
};

export default function RoadmapPanel() {
  const [selected, setSelected] = useState(1);
  const current = tracks[selected];

  return (
    <div className="tab-pane active" id="tab-production">
      <div className="panel glass">
        <h2>Roadmap Tracks &amp; Milestones</h2>
        <p className="panel-desc" style={{ marginBottom: "2rem" }}>
          Click on any track below to view milestones and dependencies — the same tracks enumerated in{" "}
          <code>moon/ROADMAP.md</code> and broken down per-module under <code>docs/moon/roadmaps/</code>.
        </p>

        <div className="sprints-interactive-grid">
          <div className="sprint-header-buttons">
            {Object.entries(tracks).map(([id, t]) => (
              <button
                key={id}
                className={`sprint-nav-btn${selected === Number(id) ? " active" : ""}`}
                onClick={() => setSelected(Number(id))}
              >
                {t.title}
              </button>
            ))}
          </div>

          <div className="sprint-display-panel panel-dark" key={selected}>
            <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.3rem" }}>{current.title}</h4>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--accent-2)",
                fontWeight: "bold",
                display: "block",
                marginBottom: "0.8rem",
              }}
            >
              {current.timeline}
            </span>
            <strong style={{ fontSize: "0.85rem", color: "var(--text)" }}>Milestone Checklist:</strong>
            <ul className="roadmap-list">
              {current.goals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            <div
              style={{
                marginTop: "1rem",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "0.8rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              <strong>Dependencies:</strong> {current.deps}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
