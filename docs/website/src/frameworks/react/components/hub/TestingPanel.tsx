import { useState } from "react";

export default function TestingPanel() {
  const [editRate, setEditRate] = useState(50);
  const [parseErrors, setParseErrors] = useState(0);
  const [reparseJitter, setReparseJitter] = useState(5);

  const drift = editRate * 0.05 + parseErrors * 1.2 + reparseJitter * 0.3;
  const invariantBroken = editRate > 120 || parseErrors > 2.0 || reparseJitter > 15;
  const logs = invariantBroken
    ? [
        "[SYSTEM] Running anchor-invariant diagnostics...",
        `[WARNING] Edit rate: ${editRate}/s exceeds incremental re-parse budget.`,
        `[ERROR] Anchor drift: ${drift.toFixed(1)} bytes. file_id/start_byte/end_byte stale after tree.edit().`,
      ]
    : [
        "[SYSTEM] Running anchor-invariant diagnostics...",
        "[BASE] C API byte-offset round-trip checks completed.",
        `[SYSTEM] GrafeoDB ingest: OK. Re-parse jitter: ${reparseJitter}ms.`,
      ];

  return (
    <div className="tab-pane active" id="tab-qa">
      <div className="grid-2-col">
        <div className="panel glass">
          <h2>Automated Diagnostics &amp; Anchor Audits</h2>
          <p>
            Per-module test suites (<code>pixi run test</code>, <code>uv run pytest</code>, <code>npm test</code>,{" "}
            <code>cargo test</code>) run stress passes checking for byte-offset anchor drift, C API boundary
            leakage, and graph-ingest transactionality — see <code>docs/TESTING.md</code>.
          </p>
          <div className="panel-dark profile-panel" style={{ marginTop: "1.5rem" }}>
            <h4>Incremental Re-parse Profiler</h4>
            <div className="slider-group">
              <label>
                Simulated edit rate: <span>{editRate}/s</span>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={editRate}
                onChange={(e) => setEditRate(Number(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-group">
              <label>
                Parse error ratio: <span>{parseErrors.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={parseErrors}
                onChange={(e) => setParseErrors(Number(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-group">
              <label>
                Re-parse jitter (ms): <span>{reparseJitter}ms</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={reparseJitter}
                onChange={(e) => setReparseJitter(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>

        <div className="panel glass flex-center">
          <h3>Anchor Invariant Dashboard</h3>
          <div className="qa-status-box">
            <div className={`alert-banner${invariantBroken ? " warning" : ""}`}>
              <span>{invariantBroken ? "⚠️ ANCHOR DRIFT DETECTED" : "🟢 ANCHORS CONSISTENT"}</span>
            </div>
            <div className="stat-row" style={{ marginTop: "1rem" }}>
              <span>Invariant state:</span> <strong>{invariantBroken ? "CRITICAL — anchor drift" : "Consistent"}</strong>
            </div>
            <div className="stat-row">
              <span>Drift magnitude:</span>
              <strong className="highlight" style={{ color: invariantBroken ? "var(--accent)" : "var(--accent-2)" }}>
                {drift.toFixed(1)} bytes
              </strong>
            </div>
            <div
              className="panel-dark"
              style={{ marginTop: "1rem", fontFamily: "monospace", fontSize: "0.75rem", height: "100px", overflowY: "auto" }}
            >
              {logs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
