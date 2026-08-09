import { useState } from "react";

interface RouteCell {
  row: number;
  col: number;
  type: "clear" | "source" | "target" | "corridor" | "route";
}

const GRID_SIZE = 8;

function buildGrid(): RouteCell[] {
  const grid: RouteCell[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let type: RouteCell["type"] = "clear";
      if (r === 0 && c === 0) type = "source";
      else if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) type = "target";
      grid.push({ row: r, col: c, type });
    }
  }
  return grid;
}

function setCells(grid: RouteCell[], coords: { r: number; c: number }[], type: RouteCell["type"]): RouteCell[] {
  const next = grid.map((c) => ({ ...c }));
  coords.forEach(({ r, c }) => {
    const cell = next[r * GRID_SIZE + c];
    if (cell) cell.type = type;
  });
  return next;
}

function clearNonAnchors(grid: RouteCell[]): RouteCell[] {
  return grid.map((cell) =>
    cell.type !== "source" && cell.type !== "target" ? { ...cell, type: "clear" } : cell
  );
}

function routeCellClass(cell: RouteCell) {
  return [
    "ga-cell",
    cell.type === "source" && "ga-spawn",
    cell.type === "target" && "ga-keep",
    cell.type === "corridor" && "ga-wall",
    cell.type === "route" && "ga-path",
  ]
    .filter(Boolean)
    .join(" ");
}

function routeCellIcon(cell: RouteCell) {
  if (cell.type === "source") return "⛩️";
  if (cell.type === "target") return "🕸️";
  if (cell.type === "route") return "🔸";
  return "";
}

export default function TechPanel() {
  const [grid, setGrid] = useState<RouteCell[]>(buildGrid);
  const [gen, setGen] = useState(0);
  const [bestFitness, setBestFitness] = useState(0);
  const [avgFitness, setAvgFitness] = useState(0);

  function reset() {
    setGen(0);
    setBestFitness(0);
    setAvgFitness(0);
    setGrid((prev) => clearNonAnchors(prev));
  }

  function runGeneration() {
    const nextGen = gen + 1;
    setGen(nextGen);

    let targetBest: number;
    let targetAvg: number;
    if (nextGen < 5) {
      targetBest = 16;
      targetAvg = 12.2;
    } else if (nextGen < 15) {
      targetBest = 20;
      targetAvg = 15.6;
    } else if (nextGen < 30) {
      targetBest = 24;
      targetAvg = 19.8;
    } else {
      targetBest = 28;
      targetAvg = 23.4;
    }
    setBestFitness(targetBest);
    setAvgFitness(targetAvg + (Math.random() * 1.5 - 0.75));

    let corridorCoords: { r: number; c: number }[];
    let routeCoords: { r: number; c: number }[];
    if (nextGen < 5) {
      corridorCoords = [{ r: 1, c: 2 }, { r: 2, c: 5 }, { r: 4, c: 1 }, { r: 5, c: 6 }, { r: 6, c: 3 }];
      routeCoords = [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 4, c: 5 }, { r: 5, c: 5 }, { r: 6, c: 5 }, { r: 7, c: 5 }, { r: 7, c: 6 }];
    } else if (nextGen < 15) {
      corridorCoords = [{ r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 5, c: 5 }, { r: 6, c: 5 }, { r: 4, c: 5 }];
      routeCoords = [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 6 }, { r: 5, c: 6 }, { r: 6, c: 6 }, { r: 7, c: 6 }];
    } else if (nextGen < 30) {
      corridorCoords = [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 5 }, { r: 4, c: 6 }, { r: 4, c: 7 }];
      routeCoords = [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 }, { r: 1, c: 6 }, { r: 2, c: 6 }, { r: 3, c: 6 }, { r: 3, c: 5 }, { r: 3, c: 4 }, { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 4, c: 1 }, { r: 5, c: 1 }, { r: 6, c: 1 }, { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 }];
    } else {
      corridorCoords = [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 5 }, { r: 4, c: 6 }, { r: 4, c: 7 }, { r: 6, c: 0 }, { r: 6, c: 1 }];
      routeCoords = [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 }, { r: 0, c: 7 }, { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 3, c: 6 }, { r: 3, c: 5 }, { r: 3, c: 4 }, { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 3, c: 0 }, { r: 4, c: 0 }, { r: 5, c: 0 }, { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 5, c: 5 }, { r: 5, c: 6 }, { r: 6, c: 6 }, { r: 7, c: 6 }];
    }

    setGrid((prev) => {
      let next = clearNonAnchors(prev);
      next = setCells(next, corridorCoords, "corridor");
      next = setCells(next, routeCoords, "route");
      return next;
    });
  }

  return (
    <div className="tab-pane active" id="tab-tech">
      <div className="grid-2-col">
        <div className="panel glass">
          <h2>Core Architecture &amp; OR Layout Engine</h2>
          <p>
            The parsing/graph core is isolated in a standalone C++20 library (<code>base/</code>), exposed to every
            frontend via a <strong>stable C API</strong> and a <strong>WebSocket/IPC server</strong> — extension,
            plugin, and app never reimplement engine logic.
          </p>
          <ul>
            <li>
              <strong>GrafeoDB</strong>: embedded graph + vector database — one store for the code property graph
              and its embeddings, queried via Cypher/GQL.
            </li>
            <li>
              <strong>Byte-offset anchors</strong>: every node/edge carries <code>file_id</code>/
              <code>start_byte</code>/<code>end_byte</code>, kept in sync via tree-sitter's <code>tree.edit()</code>{" "}
              on every text change.
            </li>
          </ul>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Evolve Orthogonal Edge Routes</h3>
          <p className="panel-desc">
            backend/'s OR layout engine runs stress majorization with a MIP refinement pass to evolve edge routing
            that separates crossing edges within a routing budget.
          </p>
          <div className="panel-dark ga-controls-box" style={{ marginTop: "1rem" }}>
            <div className="stat-row">
              <span>Generation:</span> <strong>{gen}</strong>
            </div>
            <div className="stat-row">
              <span>Best Fitness (Route Separation):</span> <strong>{bestFitness}</strong>
            </div>
            <div className="stat-row">
              <span>Average Fitness:</span> <strong>{avgFitness.toFixed(1)}</strong>
            </div>
            <div className="btn-row" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-sm btn-primary" onClick={runGeneration}>
                🧬 Evolve generation
              </button>
              <button className="btn btn-sm btn-secondary" onClick={reset}>
                🔄 Reset layout
              </button>
            </div>
          </div>
        </div>

        <div className="panel glass flex-center">
          <h3>Orthogonal Routing Grid</h3>
          <p className="panel-desc" style={{ marginBottom: "1rem" }}>
            Reserved routing corridors (red) separate the evolved edge route (gold) from source (blue) to target
            (purple).
          </p>
          <div className="ga-grid-container" style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "2px",
                width: "320px",
                height: "320px",
                background: "rgba(0, 0, 0, 0.3)",
                border: "2px solid var(--border-color)",
                borderRadius: "4px",
                padding: "2px",
              }}
            >
              {grid.map((cell) => (
                <div key={cell.row + "-" + cell.col} className={routeCellClass(cell)}>
                  {routeCellIcon(cell)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
