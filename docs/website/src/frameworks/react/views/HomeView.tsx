import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import DesignPanel from "../components/hub/DesignPanel";
import TechPanel from "../components/hub/TechPanel";
import BenchmarksPanel from "../components/hub/BenchmarksPanel";
import RoadmapPanel from "../components/hub/RoadmapPanel";
import TestingPanel from "../components/hub/TestingPanel";
import LayoutForceFieldWrapper from "../../astro/components/LayoutForceFieldWrapper";
import NodeKindRoster from "../NodeKindRoster";
import ConvergenceChartWrapper from "../../aurelia/ConvergenceChartWrapper";
import ConvergenceStatus from "../components/hub/ConvergenceStatus";
import ApolloGraphPanel from "../../apollo/ApolloGraphPanel";

interface Tab {
  id: string;
  nav: string;
  icon: string;
  label: string;
  component: ComponentType;
}

const TABS: Tab[] = [
  { id: "design", nav: "Design", icon: "🕸️", label: "Design Hub", component: DesignPanel },
  { id: "tech", nav: "Tech", icon: "⚙️", label: "Tech Stack", component: TechPanel },
  { id: "benchmarks", nav: "Benchmarks", icon: "📈", label: "Benchmarks", component: BenchmarksPanel },
  { id: "roadmap", nav: "Roadmap", icon: "📅", label: "Roadmap", component: RoadmapPanel },
  { id: "testing", nav: "Testing", icon: "🔬", label: "Testing Suite", component: TestingPanel },
];

const PHASES = [
  {
    title: "Track A: Base + Backend Modules",
    date: "Core-first",
    desc: "C++20 parsing/graph core (base/) and Python Graph-RAG/OR-layout sidecar (backend/) — Tree-sitter, GrafeoDB ingestion, a stable C API and WebSocket/IPC server.",
  },
  {
    title: "Track B: IDE Extension (VS Code)",
    date: "After Track A's C API",
    desc: "Webview graph panel (React Flow), LSP call-hierarchy extraction, and bidirectional navigation between the graph and the editor.",
  },
  {
    title: "Track C: Unreal Engine Plugin",
    date: "After Track A's C API",
    desc: "UEdGraph/Slate visual scripting over native C++, lossless round-trip text↔graph splicing, and Live Coding integration.",
  },
  {
    title: "Track D: Standalone Tauri App",
    date: "After Tracks A/B/C stabilize",
    desc: "Rust core supervising C++ and Python sidecars, the main graph canvas, the OR layout service, and a Graph-RAG assistant panel backed by MCP.",
  },
];

const NUM_NODES = 40;

class DriftingNode {
  x = 0;
  y = 0;
  size = 0;
  speedX = 0;
  speedY = 0;
  opacity = 0;
  constructor(
    private width: number,
    private height: number
  ) {
    this.reset();
    this.y = Math.random() * height;
  }
  reset() {
    this.x = Math.random() * this.width;
    this.y = -20;
    this.size = Math.random() * 2.5 + 1.5;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.random() * 1.5 - 0.5;
    this.opacity = Math.random() * 0.4 + 0.3;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y / 30) * 0.5;
    if (this.y > this.height + 20 || this.x > this.width + 20 || this.x < -20) this.reset();
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(129, 195, 245, ${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

export default function HomeView() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const ActiveComponent = useMemo(() => TABS.find((t) => t.id === activeTab)!.component, [activeTab]);

  function scrollToHub() {
    document.getElementById("design-hub")?.scrollIntoView({ behavior: "smooth" });
  }

  // --- Drifting graph-node canvas background (a lightweight, purely decorative flourish) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let nodes: DriftingNode[] = [];

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        nodes.forEach((n) => {
          n.update();
          n.draw(ctx);
        });
      }
      raf = requestAnimationFrame(animate);
    }

    resize();
    nodes = Array.from({ length: NUM_NODES }, () => new DriftingNode(width, height));
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="home">
      <canvas ref={canvasRef} className="blossoms-canvas" />

      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="badge">DEVELOPMENT CONSOLE V3.0</div>
          <h1>Visualize the Codebase, Not Just the Text</h1>
          <p className="hero-desc">
            A multi-platform codebase visualization and visual programming tool — Tree-sitter parsing into a
            queryable code property graph, an embedded graph + vector database, and mathematically-optimized
            layouts that stay bidirectionally synchronized with the underlying text.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={scrollToHub}>
              Try Design Simulators
            </button>
            <Link to="/architecture" className="btn btn-secondary">
              Read the Architecture
            </Link>
            <Link to="/docs" className="btn btn-secondary">
              Browse Documentation
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="hub-tabs-section" id="design-hub">
          <div className="tabs-header">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="icon">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
          <div className="tabs-content">
            <ActiveComponent />
          </div>
        </section>

        {/* Astro island: layout force-field design visualization */}
        <LayoutForceFieldWrapper height="460px" />

        {/* React island: live graph-entity roster (src/constants/graphSchema.ts) */}
        <section className="react-island-wrap panel">
          <p className="island-label">Framework island · React — live graph-entity roster (src/constants/graphSchema.ts)</p>
          <NodeKindRoster />
        </section>

        {/* Aurelia island: OR-layout stress-majorization convergence chart (src/simulations/) */}
        <ConvergenceChartWrapper />

        {/* Cross-framework parity kit: the same convergenceSummary() text as
            the Aurelia island's own role="status" region above, rendered
            natively in React from the same src/simulations/ data. */}
        <ConvergenceStatus />

        {/* Apollo/GraphQL island: docs/content graph (src/graphql/schema.graphql) */}
        <ApolloGraphPanel />

        <section className="roadmap-section">
          <h2 className="section-title">Visual Graph Programming Roadmap</h2>
          <div className="timeline">
            {PHASES.map((phase, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="timeline-badge">{idx + 1}</div>
                <div className="timeline-panel panel">
                  <h3>{phase.title}</h3>
                  <span className="timeline-date">{phase.date}</span>
                  <p>{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
