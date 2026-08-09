import { useRef, useState } from "react";
import { useIntersect } from "../../../hooks/useIntersect";
import { siteBaseUrl } from "../../../utils/baseUrl";
import "./LayoutForceFieldWrapper.css";

export default function LayoutForceFieldWrapper({
  height = "420px",
  title = "Astro layout force field island",
}: {
  height?: string;
  title?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useIntersect(sectionRef, () => setInView(true), { once: true, threshold: 0.2 });

  // public/ assets need the site base when deployed under a GitHub Pages subpath.
  const islandSrc = `${siteBaseUrl()}astro-island/index.html`;

  return (
    <section className="astro-island-wrap" data-in-view={inView ? "true" : "false"} ref={sectionRef}>
      <header className="wrap-header">
        <p className="kicker">Framework island · Astro</p>
        <h2>Layout force field</h2>
        <p className="lede">
          Static Astro island illustrating call- and import-edge attraction vectors toward a root node — a
          design-hub companion to the OR layout engine notes in the tech stack panel.
        </p>
      </header>

      <div className="frame-shell" style={{ minHeight: height }}>
        {failed && (
          <p className="fallback" role="alert">
            Astro island failed to load. Rebuild with <code>npm run build:astro</code> so{" "}
            <code>public/astro-island/</code> is present.
          </p>
        )}
        <iframe
          className="island-frame"
          style={{ height, display: failed ? "none" : undefined }}
          src={islandSrc}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
        {!loaded && !failed && <p className="loading">Loading Astro island…</p>}
      </div>
    </section>
  );
}
