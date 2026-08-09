# Visual Graph Programming - Root Justfile
# https://github.com/casey/just
# Entry point. All recipes delegate to sub-modules via `mod`.
# Invoke sub-module recipes directly with dot notation: just build::cpp
# Or use the root shorthands defined below.
#
# Module map: base/ (C++20, pixi+CMake), backend/ (Python 3.12, uv),
# extension/ + app/ (TypeScript, npm workspaces), app/src-tauri (Rust,
# Cargo workspace). See .agent/AGENTS.md's Module Map & Tech Stack table.

set shell := ["bash", "-c"]

red := '\033[0;31m'
green := '\033[0;32m'
yellow := '\033[0;33m'
blue := '\033[0;34m'
purple := '\033[0;35m'
cyan := '\033[0;36m'
bold := '\033[1m'
reset := '\033[0m'

# --- Submodules ---

mod agent 'tools/agent/justfile'
mod build 'tools/build'
mod ci 'tools/ci'
mod docs 'tools/docs'
mod helper 'tools/helper'
mod reducer 'tools/reducer'
mod test 'tools/test'
mod validation 'tools/validation'

# --- Default target ---

default: help

# --- Help ---

# Print available commands
help: helper::_print_header
    @echo -e "{{bold}}Build{{reset}}"
    @echo "  just cpp-build              Configure + build the C++ base module (base/, via pixi)"
    @echo "  just build-extension        Build the VS Code extension (extension/)"
    @echo "  just build-app              Build the Tauri app (app/)"
    @echo "  just build-rust             Build the Rust core (app/src-tauri, via cargo)"
    @echo ""
    @echo -e "{{bold}}Test{{reset}}"
    @echo "  just cpp-test               Run the C++ base module test suite (pixi run test)"
    @echo "  just py-test                Run the Python backend test suite (uv run pytest)"
    @echo "  just ts-test                Run extension/ + app/ tests (npm test)"
    @echo "  just rust-test              Run the Rust core test suite (cargo test)"
    @echo ""
    @echo -e "{{bold}}Lint / Format{{reset}}"
    @echo "  just lint-check             Lint every module (ruff, eslint, clippy)"
    @echo "  just format                 Auto-format every module (ruff format, prettier, cargo fmt)"
    @echo ""
    @echo -e "{{bold}}CI / Maintenance{{reset}}"
    @echo "  just check                  Full local pre-PR gate: lint -> test -> build, all modules"
    @echo "  just clean                  Remove build outputs for every module"
    @echo ""
    @echo -e "{{bold}}Docs{{reset}}"
    @echo "  just build-docs             Build the full VGP documentation site (docs/build_docs.sh)"
    @echo ""
    @echo -e "{{bold}}Agentic LLM Loops (tools/agent/){{reset}}"
    @echo "  just loop-claude             Loop the Claude Code agent on a stateful context"
    @echo "  just loop-grok               Loop the Grok agent on a stateful context"
    @echo "  just loop-gemini             Loop the Gemini agent on a stateful context"
    @echo "  just loop-chatgpt            Loop the ChatGPT agent on a stateful context"
    @echo ""
    @echo "Run 'just <module>::' with no recipe to list that module's recipes, e.g. 'just build::'"

# --- Shorthands ---
# Note: none of these share a name with a `mod` above (just forbids that);
# use the module directly (e.g. `just build::cpp`) for anything not listed here.

# Loop the Claude Code agent on a stateful context
loop-claude prompt="Continue implementing the roadmap, updating moon/ROADMAP.md and moon/CHANGELOG.md, and committing your work": helper::_print_header
    just agent::loop-claude "{{prompt}}"

# Loop the Grok agent on a stateful context
loop-grok prompt="Continue implementing the roadmap, updating moon/ROADMAP.md and moon/CHANGELOG.md, and committing your work": helper::_print_header
    just agent::loop-grok "{{prompt}}"

# Loop the Gemini agent on a stateful context
loop-gemini prompt="Continue implementing the roadmap, updating moon/ROADMAP.md and moon/CHANGELOG.md, and committing your work": helper::_print_header
    just agent::loop-gemini "{{prompt}}"

# Loop the ChatGPT agent on a stateful context
loop-chatgpt prompt="Continue implementing the roadmap, updating moon/ROADMAP.md and moon/CHANGELOG.md, and committing your work": helper::_print_header
    just agent::loop-chatgpt "{{prompt}}"

# Configure + build the C++ base module (base/, via pixi)
cpp-build: helper::_print_header
    just build::cpp

# Build the VS Code extension (extension/)
build-extension: helper::_print_header
    just build::extension

# Build the Tauri app (app/)
build-app: helper::_print_header
    just build::app

# Build the Rust core (app/src-tauri, via cargo)
build-rust: helper::_print_header
    just build::rust

# Run the C++ base module test suite
cpp-test: helper::_print_header
    just test::cpp

# Run the Python backend test suite
py-test: helper::_print_header
    just test::py

# Run extension/ + app/ tests
ts-test: helper::_print_header
    just test::ts

# Run the Rust core test suite
rust-test: helper::_print_header
    just test::rust

# Lint every module
lint-check: helper::_print_header
    just validation::check

# Auto-format every module
format: helper::_print_header
    just validation::fix

# Full local pre-PR gate: lint, test, build, all modules
check: helper::_print_header
    just ci::pr-gate

# Remove build outputs for every module
clean: helper::_print_header
    just reducer::clean

# Build the full VGP documentation site
build-docs: helper::_print_header
    just docs::build
