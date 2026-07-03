#!/usr/bin/env bash
# Build the complete VGP documentation site.
#
# Layers:
#   1. Per-module API references (Sphinx, Doxygen, TypeDoc, rustdoc)
#   2. MkDocs narrative site (docs/mkdocs.yml)
#   3. Copy API references into the site under site/api/<module>/
#
# Tolerant by design: modules not yet scaffolded, or tools missing from the
# environment, are skipped with a notice so the docs build at every roadmap
# stage. Run from anywhere; paths resolve to the repo root.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD="$ROOT/docs/_build"
API="$BUILD/api"
SITE="$BUILD/site"
mkdir -p "$API"

note()  { printf '\033[1;34m[docs]\033[0m %s\n' "$*"; }
skip()  { printf '\033[1;33m[skip]\033[0m %s\n' "$*"; }
fail=0

# ---------------------------------------------------------------- backend (Sphinx)
# Uses the existing venv (--no-sync) so docs never force a full project sync.
if command -v uv >/dev/null && (cd "$ROOT" && uv run --no-sync python -c 'import sphinx' 2>/dev/null); then
  note "Sphinx: building Python backend API"
  (cd "$ROOT" && uv run --no-sync sphinx-build -q -b html docs/backend "$API/backend") || fail=1
else
  skip "Sphinx not available — run: uv sync --group docs"
fi

# ---------------------------------------------------------------- base / plugin (Doxygen)
run_doxygen() { # $1=config  $2=output-subdir  $3=source-dir-guard
  local cfg="$1" out="$2" guard="$3"
  if [ ! -d "$ROOT/$guard" ]; then
    skip "Doxygen ($out): $guard/ not scaffolded yet"
    return
  fi
  if command -v doxygen >/dev/null; then
    note "Doxygen: building $out API"
    (cd "$ROOT" && doxygen "$cfg" >/dev/null) || { fail=1; return; }
  elif command -v pixi >/dev/null; then
    note "Doxygen (via pixi): building $out API"
    (cd "$ROOT" && pixi run -q doxygen "$cfg" >/dev/null) || { fail=1; return; }
  else
    skip "doxygen not found — run: pixi install"
    return
  fi
  rm -rf "$API/$out"
  mv "$API/$out-doxygen/html" "$API/$out" && rm -rf "$API/$out-doxygen"
}
run_doxygen docs/base/Doxyfile   base   base/src
run_doxygen docs/plugin/Doxyfile plugin plugin/Source

# ---------------------------------------------------------------- extension / app (TypeDoc)
run_typedoc() { # $1=workspace  $2=config
  local ws="$1" cfg="$2"
  if [ ! -d "$ROOT/$ws/src" ] || [ ! -f "$ROOT/$ws/tsconfig.json" ]; then
    skip "TypeDoc ($ws): src/ or tsconfig.json not scaffolded yet"
    return
  fi
  if [ ! -d "$ROOT/node_modules" ]; then
    skip "TypeDoc ($ws): node_modules missing — run: npm install"
    return
  fi
  note "TypeDoc: building $ws API"
  (cd "$ROOT" && npx typedoc --options "$cfg") || fail=1
}
run_typedoc extension docs/extension/typedoc.json
run_typedoc app       docs/app/typedoc.json

# ---------------------------------------------------------------- rust (rustdoc)
if command -v cargo >/dev/null; then
  note "rustdoc: building Rust core API"
  if (cd "$ROOT" && cargo doc --no-deps -p vgp-app -q); then
    rm -rf "$API/rust"
    cp -r "$ROOT/target/doc" "$API/rust"
  else
    fail=1
  fi
else
  skip "cargo not found — install the Rust toolchain"
fi

# ---------------------------------------------------------------- MkDocs umbrella
if command -v uv >/dev/null && (cd "$ROOT" && uv run --no-sync python -c 'import mkdocs' 2>/dev/null); then
  note "MkDocs: building the narrative site"
  (cd "$ROOT" && uv run --no-sync mkdocs build -q -f docs/mkdocs.yml) || fail=1
  if [ -d "$SITE" ]; then
    note "Copying API references into site/api/"
    mkdir -p "$SITE/api"
    for d in "$API"/*/; do
      [ -d "$d" ] && cp -r "$d" "$SITE/api/$(basename "$d")"
    done
    note "Done → open $SITE/index.html"
  fi
else
  skip "MkDocs not available — run: uv sync --group docs"
fi

exit $fail
