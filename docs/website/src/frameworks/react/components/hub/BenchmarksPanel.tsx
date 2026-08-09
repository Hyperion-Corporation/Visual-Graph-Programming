import { useEffect, useMemo, useRef, useState } from "react";

export default function BenchmarksPanel() {
  const [nodeCount, setNodeCount] = useState(2);
  const [editBurst, setEditBurst] = useState(0);
  const [queryLoad, setQueryLoad] = useState(0);
  const [waveHeights, setWaveHeights] = useState<number[]>(() => Array.from({ length: 20 }, () => 8));
  const rafRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queryText = queryLoad === 1 ? "Light Graph-RAG query" : queryLoad === 2 ? "Heavy multi-hop query" : "None";
  const queryMod = queryLoad === 1 ? 0.15 : queryLoad === 2 ? 0.4 : 0;
  const load = Math.min(1, Math.max(0, nodeCount * 0.008 + editBurst * 0.003 + queryMod));
  const state = load > 0.6 ? "Latency Pressure" : load > 0.25 ? "Steady State" : "Idle";
  const desc =
    load > 0.6
      ? "Incremental re-parse queue backing up — invalidated regions batching before ingest keeps up."
      : load > 0.25
        ? "Re-parsing edited subtrees and streaming viewport-scoped subgraph updates on schedule."
        : "Idle: no pending edits, no in-flight Graph-RAG queries.";
  const activeClass = load > 0.6 ? "active-warn" : load > 0.25 ? "active-gold" : "";

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    function animate() {
      const L = loadRef.current;
      setWaveHeights(
        Array.from({ length: 20 }, () => {
          const base = 5 + L * 40;
          const variance = Math.random() * (10 + L * 30);
          return Math.min(75, base + variance);
        })
      );
      timeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(animate);
      }, 120);
    }
    animate();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const wavesKey = useMemo(() => waveHeights.map((_, i) => i), [waveHeights.length]);

  return (
    <div className="tab-pane active" id="tab-audio">
      <div className="grid-2-col">
        <div className="panel glass">
          <h2>Adaptive Load &amp; Latency Budget</h2>
          <p>
            Incremental re-parse and Graph-RAG retrieval latency scale with graph size and query pressure. This
            models the combined load using a centralized <strong>Load Scale</strong> ($L$), the same targets
            tracked in <code>docs/BENCHMARKS.md</code>:
          </p>
          <p className="math-formula">
            {"$$L = w_1 \\cdot \\text{GraphNodes} + w_2 \\cdot \\text{EditBurst} + w_3 \\cdot \\text{QueryLoad}$$"}
          </p>
          <div className="panel-dark profile-panel" style={{ marginTop: "1rem" }}>
            <h4>Load Modulators</h4>
            <div className="slider-group">
              <label>
                Active graph nodes (k): <span>{nodeCount}</span>
              </label>
              <input
                type="range"
                min="0"
                max="60"
                value={nodeCount}
                onChange={(e) => setNodeCount(Number(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-group">
              <label>
                Edit burst intensity: <span>{editBurst}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editBurst}
                onChange={(e) => setEditBurst(Number(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-group">
              <label>
                Concurrent MCP query: <span>{queryText}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                value={queryLoad}
                onChange={(e) => setQueryLoad(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>

        <div className="panel glass flex-center">
          <h3>Re-parse &amp; Retrieval Latency Waveform</h3>
          <div className="audio-visualization-box panel-dark">
            <div className="wave-visualizer-container">
              <div className="audio-wave">
                {wavesKey.map((i) => (
                  <div
                    key={i}
                    className={`wave-bar${activeClass ? " " + activeClass : ""}`}
                    style={{ height: waveHeights[i] + "px" }}
                  />
                ))}
              </div>
            </div>
            <div className="stat-row" style={{ marginTop: "1rem" }}>
              <span>Pipeline state:</span> <strong className="highlight">{state}</strong>
            </div>
            <div className="stat-row">
              <span>Calculated load ($L$):</span> <strong>{load.toFixed(2)}</strong>
            </div>
            <div className="ai-speech" style={{ marginTop: "1rem" }}>
              <strong>Current behavior:</strong>
              <p>{desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
