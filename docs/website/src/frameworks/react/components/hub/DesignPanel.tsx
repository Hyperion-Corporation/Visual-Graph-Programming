import { useEffect, useRef, useState } from "react";

interface Point {
  row: number;
  col: number;
}
interface Cell {
  row: number;
  col: number;
  type: "clear" | "wall" | "crossmodule" | "origin" | "root";
  cost: number;
  distance: number;
  vector: { x: number; y: number };
  arrow: string;
}
interface Token {
  id: number;
  r: number;
  c: number;
}

const GRID_SIZE = 12;
const originPoints: Point[] = [
  { row: 0, col: 0 },
  { row: 0, col: 11 },
  { row: 11, col: 0 },
];
const rootPoint: Point = { row: 5, col: 5 };

function isOrigin(r: number, c: number) {
  return originPoints.some((p) => p.row === r && p.col === c);
}
function isRootCell(r: number, c: number) {
  return rootPoint.row === r && rootPoint.col === c;
}

function buildGrid(): Cell[] {
  const grid: Cell[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let type: Cell["type"] = "clear";
      if (isRootCell(r, c)) type = "root";
      else if (isOrigin(r, c)) type = "origin";
      grid.push({
        row: r,
        col: c,
        type,
        cost: 1,
        distance: Infinity,
        vector: { x: 0, y: 0 },
        arrow: "",
      });
    }
  }
  return grid;
}

function cellAt(grid: Cell[], r: number, c: number) {
  return grid[r * GRID_SIZE + c];
}

function neighbors(grid: Cell[], r: number, c: number) {
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  const res: Cell[] = [];
  dirs.forEach(([dr, dc]) => {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) res.push(cellAt(grid, nr, nc));
  });
  return res;
}

const ARROWS: Record<string, string> = {
  "1,0": "→",
  "0,-1": "↑",
  "0,1": "↓",
  "-1,0": "←",
  "-1,-1": "↖",
  "1,-1": "↗",
  "-1,1": "↙",
  "1,1": "↘",
};

function recalc(grid: Cell[]): Cell[] {
  const next = grid.map((cell) => ({ ...cell, distance: Infinity, vector: { x: 0, y: 0 }, arrow: "" }));
  const start = cellAt(next, rootPoint.row, rootPoint.col);
  start.distance = 0;
  const queue: Cell[] = [start];
  while (queue.length) {
    const current = queue.shift()!;
    neighbors(next, current.row, current.col).forEach((n) => {
      if (n.type === "wall") return;
      const tentative = current.distance + n.cost;
      if (tentative < n.distance) {
        n.distance = tentative;
        queue.push(n);
      }
    });
  }
  next.forEach((cell) => {
    if (cell.type === "wall" || cell.type === "root") return;
    let minDist = cell.distance;
    let target: Cell | null = null;
    neighbors(next, cell.row, cell.col).forEach((n) => {
      if (n.type !== "wall" && n.distance < minDist) {
        minDist = n.distance;
        target = n;
      }
    });
    if (target) {
      const t = target as Cell;
      const dx = t.col - cell.col;
      const dy = t.row - cell.row;
      cell.vector = { x: dx, y: dy };
      cell.arrow = ARROWS[dx + "," + dy] || "→";
    }
  });
  return next;
}

function cellClass(cell: Cell) {
  return [
    "grid-cell",
    cell.type === "origin" && "cell-spawn",
    cell.type === "root" && "cell-keep",
    cell.type === "wall" && "cell-wall",
    cell.type === "crossmodule" && "cell-swamp",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function DesignPanel() {
  const [grid, setGrid] = useState<Cell[]>(() => recalc(buildGrid()));
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tool, setTool] = useState<"wall" | "crossmodule" | "clear">("wall");
  const [cellWidth, setCellWidth] = useState(36);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tokenIdRef = useRef(0);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridStateRef = useRef(grid);
  gridStateRef.current = grid;

  useEffect(() => {
    function updateCellWidth() {
      if (gridRef.current) setCellWidth(gridRef.current.clientWidth / GRID_SIZE);
    }
    updateCellWidth();
    window.addEventListener("resize", updateCellWidth);
    return () => {
      window.removeEventListener("resize", updateCellWidth);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  function handleCellClick(cell: Cell) {
    if (cell.type === "root" || cell.type === "origin") return;
    setGrid((prev) => {
      const next = prev.map((c) => ({ ...c }));
      const target = cellAt(next, cell.row, cell.col);
      if (tool === "wall") {
        target.type = target.type === "wall" ? "clear" : "wall";
        target.cost = target.type === "wall" ? 99 : 1;
      } else if (tool === "crossmodule") {
        target.type = target.type === "crossmodule" ? "clear" : "crossmodule";
        target.cost = target.type === "crossmodule" ? 3 : 1;
      } else {
        target.type = "clear";
        target.cost = 1;
      }
      return recalc(next);
    });
  }

  function resetGrid() {
    setTokens([]);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setGrid(recalc(buildGrid()));
  }

  function tick() {
    setTokens((prev) => {
      if (!prev.length) {
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        return prev;
      }
      const next: Token[] = [];
      for (const t of prev) {
        if (t.r === rootPoint.row && t.c === rootPoint.col) continue;
        const cell = cellAt(gridStateRef.current, t.r, t.c);
        if (!cell || cell.type === "wall") continue;
        const nr = t.r + cell.vector.y;
        const nc = t.c + cell.vector.x;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) next.push({ ...t, r: nr, c: nc });
      }
      return next;
    });
  }

  function spawnTokens() {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    originPoints.forEach((sp, idx) => {
      setTimeout(
        () => setTokens((prev) => [...prev, { id: tokenIdRef.current++, r: sp.row, c: sp.col }]),
        idx * 400
      );
      setTimeout(
        () => setTokens((prev) => [...prev, { id: tokenIdRef.current++, r: sp.row, c: sp.col }]),
        idx * 400 + 800
      );
    });
    simIntervalRef.current = setInterval(tick, 150);
  }

  return (
    <div className="tab-pane active" id="tab-design">
      <div className="grid-3-col">
        <div className="panel glass col-span-1">
          <h2>Blast-Radius Traversal &amp; Query-Origin Design</h2>
          <p>
            <strong>Visual Graph Programming</strong> traverses the code property graph from one or more query
            origins toward a root node — the same shape as a call-hierarchy or blast-radius query, illustrated here
            as a flow field.
          </p>
          <p>
            <strong>Vector Field Traversal</strong>: Recalculates distance vectors for every cell simultaneously,
            bypassing per-token pathfinding bottlenecks — the same technique backend/'s OR layout engine uses for
            large graphs.
          </p>
          <div className="control-group">
            <label>Brush Tool:</label>
            <div className="btn-group">
              <button
                className={`btn btn-sm btn-tool${tool === "wall" ? " active" : ""}`}
                onClick={() => setTool("wall")}
              >
                🧱 Mark unreachable region
              </button>
              <button
                className={`btn btn-sm btn-tool${tool === "crossmodule" ? " active" : ""}`}
                onClick={() => setTool("crossmodule")}
              >
                🔗 Mark cross-module edge (cost: 3)
              </button>
              <button
                className={`btn btn-sm btn-tool${tool === "clear" ? " active" : ""}`}
                onClick={() => setTool("clear")}
              >
                🧹 Clear cell
              </button>
            </div>
          </div>
          <div className="control-group">
            <button className="btn btn-primary btn-block" onClick={spawnTokens}>
              🔎 Run traversal from query origins
            </button>
            <button className="btn btn-secondary btn-block" onClick={resetGrid}>
              🔄 Reset grid
            </button>
          </div>
        </div>

        <div className="panel glass col-span-2 flex-center">
          <div className="grid-simulator-container">
            <div className="legend-bar">
              <span>🔎 Query origin</span>
              <span>🕸️ Root node (goal)</span>
              <span>🧱 Unreachable region</span>
              <span>🔗 Cross-module edge</span>
            </div>
            <div className="simulator-grid" ref={gridRef}>
              {grid.map((cell) => (
                <div
                  key={cell.row + "-" + cell.col}
                  className={cellClass(cell)}
                  onMouseDown={() => handleCellClick(cell)}
                >
                  {cell.arrow && <span className="cell-arrow">{cell.arrow}</span>}
                </div>
              ))}
              {tokens.map((t) => (
                <div
                  key={t.id}
                  className="enemy-dot"
                  style={{ left: t.c * cellWidth + cellWidth / 2 + "px", top: t.r * cellWidth + cellWidth / 2 + "px" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
