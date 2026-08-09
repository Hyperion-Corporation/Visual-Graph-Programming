# CI & Automation Roadmap — Cross-Cutting

Detail for Track ROADMAP.md's Cross-Cutting section — see
[`../ROADMAP.md`](../ROADMAP.md).

Applies across every module rather than to one track.

## Cross-Cutting

- [ ] **X1** CI pipelines per module (build, lint, test, coverage upload with per-module Codecov flags per `git/codecov.yaml`).
- [ ] **X2** Documentation site and ADRs; keep `moon/CHANGELOG.md` current per release.

## Notes

- X1 is already substantially in place: `.github/workflows/ci.yml` and its
  `.forgejo`/`.gitea`/`.gitlab` mirrors run pixi (base), uv/pytest
  (backend), npm (extension/app), and cargo (app/src-tauri) jobs with
  per-module Codecov flags.
- X2's documentation site (`docs/build_docs.sh`, MkDocs + Sphinx/Doxygen/
  TypeDoc/rustdoc) is also in place; what's outstanding is keeping content
  current as each module's real API surface lands, not building the
  toolchain itself.
