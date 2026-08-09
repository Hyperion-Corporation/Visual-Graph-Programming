# Documentation Standards

VGP's documentation is split across a few distinct systems, each with a
different audience and a different source of truth. Know which one you're
editing before you edit it.

| System | Audience | Source | Built by |
| --- | --- | --- | --- |
| Narrative site (home, architecture, module guides) | Newcomers, contributors | [`docs/content/`](content/) | MkDocs (Material theme) |
| Per-module API reference | Developers integrating with a module's API | Doc comments in `base/`, `backend/`, `extension/`, `app/`, `plugin/` source | Doxygen, Sphinx, TypeDoc, rustdoc |
| Reference guides (this file, `TESTING.md`, `GLOSSARY.md`, etc.) | Contributors | `docs/*.md` (this directory, flat) | Rendered directly by the docs website portal |
| Architecture Decision Records | Anyone asking "why is it built this way" | [`docs/adr/`](adr/) | Plain markdown, one file per decision, never edited after acceptance |
| AI agent governance | Coding agents (and their reviewers) | [`.agent/AGENTS.md`](../.agent/AGENTS.md) | Plain markdown, pointed to by `CLAUDE.md`/`GEMINI.md` |

`docs/build_docs.sh` assembles the first two into one site under
`docs/_build/site/` — see [`docs/README.md`](README.md) for the full
pipeline and `bash docs/build_docs.sh`'s tolerant-skip behavior for
not-yet-scaffolded modules.

## Style

- Write for a reader who hasn't seen the conversation that produced the
  change — no unexplained shorthand, no "as discussed above" without a
  link.
- Prefer a table or a short list over a wall of prose when comparing more
  than two things (see this file's own table).
- Link to code with a real path (`base/`, `backend/`, etc.), not a
  paraphrase of where something lives.
- New Architecture Decision Records follow
  [`docs/adr/0001-record-architecture-decisions.md`](adr/0001-record-architecture-decisions.md)'s
  format; number them sequentially, and never edit one after it's
  accepted — a reversal gets a new ADR that supersedes it.

## When docs and code disagree

Treat it as a bug. File it with the `component:docs` label (see
`github/config/project_labels.json`) rather than silently working around
the discrepancy.
