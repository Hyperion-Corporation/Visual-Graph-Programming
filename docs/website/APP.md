# Why this site looks the way it does

`docs/website/` is deliberately more than a documentation static-site generator. It exists to do
two things at once: serve as Visual Graph Programming's actual documentation portal and design
hub, and serve as a working demonstration of multi-framework interop patterns.

## Why React as the primary shell

The chrome (topbar, sidebar, search, theme toggle, doc rendering, the design hub) is React 19 +
Vite, under `src/frameworks/react/`. State management lives in `src/libraries/redux/` (a small
`createStore`/`combineReducers` store, typed `useAppDispatch`/`useAppSelector`), and shell
behaviors that would otherwise be framework directives are plain hooks
(`src/hooks/useClickOutside`, `useFocusWhen`, `useIntersect`).

## Why framework islands beyond React

Three islands live under `src/frameworks/` (alongside the React shell itself), each
demonstrating a different integration mechanic:

- **Aurelia 2** (`frameworks/aurelia/`) — `convergence-chart-app.ts`, a real Aurelia custom
  element with bindable state, a `repeat.for`-driven SVG polyline, and its own play/reset
  lifecycle, mounted via `Aurelia.app({ host, component }).start()` inside a React-owned host node
  (`ConvergenceChartWrapper.tsx`, mounted/unmounted from a `useEffect`). It visualizes
  `src/simulations/`'s OR-layout stress-majorization convergence data (`generateConvergenceRun` /
  `createSimulationController`, the same data `TechPanel`'s own generation-based grid demo draws
  from) — reused rather than reinvented, since that domain logic already existed here.
  Demonstrates a framework whose component model (custom elements, binding commands) is fully
  independent of React's.
- **Apollo/GraphQL** (`frameworks/apollo/`) — `ApolloGraphPanel.tsx` runs real `@apollo/client`
  `useQuery` calls against `src/graphql/schema.graphql`'s actual `Query` fields (`graphNodes`,
  `graphEdgeLanes`, `roadmapStories`). There is no live docs backend yet (see `src/graphql`'s own
  header note), so `frameworks/apollo/client.ts` resolves those fields locally — against this
  repo's own illustrative graph-node/edge layout (`frameworks/apollo/data.ts`) and the existing
  `src/stories/` roadmap-track catalog — instead of a live network call, the same reuse ethic the
  Aurelia island applies to `src/simulations/`. Demonstrates a data-fetching layer (normalized
  cache, typed `gql` queries, loading/error states) independent of any particular UI framework.
- **Astro** (`frameworks/astro/`) — `LayoutForceField.astro`, a static call/import-edge attraction
  field converging on a root node, prebuilt into `public/astro-island/` and embedded via an
  iframe wrapper (`LayoutForceFieldWrapper.tsx`, using `useIntersect` for lazy-load/error-fallback
  behavior).

`NodeKindRoster.tsx` (`frameworks/react/`) is a native React component in `HomeView.tsx` rather
than a separate mount-into-a-foreign-host island, since the shell itself is already React. It
reads `src/constants/graphSchema.ts` directly (the same illustrative roster data `src/stories/`
draws from) and is documented in isolation via Storybook (`stories/`), built standalone into
`public/storybook/`.

This repository's only TypeScript/React codebase outside `docs/website/` is `extension/` and
`app/` (the VS Code extension and Tauri app) — `base/` is C++, `backend/` is Python, and `plugin/`
is Unreal C++. So the Aurelia, Apollo, and Astro islands here are self-contained, authored within
`docs/website/`, not imports of a pre-existing app. What they're *not* is a placeholder: each
reads and renders this project's real data (the layout-convergence simulation, the docs/content
graph, the force-field visualization) rather than a generic demo.

## Why MkDocs stays the way it is

`docs/mkdocs.yml` remains the source of truth for the documentation nav tree
(`scripts/generate-nav.mjs` parses it to build `src/nav.generated.ts`). See `docs/mkdocs.yml`'s
`nav:` and `docs/build_docs.sh` for how it fits into the docs pipeline.

## Why the extra tooling scaffolding (Next.js, TypeDoc, Storybook)

`stack/next/` is an alternate, React-capable surface over `src/frameworks/react/` — not used by
the default build (Vite drives the default build/deploy pipeline), kept so a real Next.js
requirement has a starting point instead of a from-scratch migration.

`typedoc.json` + `scripts/fix-api-links.mjs` generate `docs/api/typescript/` from
`src/simulations/` — this site's own framework-neutral simulation logic is the closest thing this
repository has to a reusable TypeScript library worth an API reference, so it's what gets
documented rather than inventing an unrelated module. `stories/` + `.storybook/` document the
React island's component(s) in isolation, built standalone into `public/storybook/`.

## Why `src/styles/tailwind.css` was added

`postcss.config.js` already wired `tailwindcss` into the PostCSS pipeline, and the hub panels
already used Tailwind utility classes — but no file in this project actually contained an
`@tailwind` directive, so none of that ever generated any CSS. This file fixes that gap directly.
It deliberately omits `@tailwind base` (Tailwind's global reset) since enabling that for the first
time on an already-shipping site is a real visual-regression risk that deserves its own reviewed
change, not a silent side effect of restoring the utility classes that were already written.
