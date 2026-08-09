[//]: # "Pointer to the source of truth — see docs/content/architecture.md's own header comment for why this repo prefers pointers over duplicated content."

# Architecture

The system architecture (module boundaries, data flow, the C++ core /
Python backend / three frontend surfaces) is documented in
[`docs/content/architecture.md`](content/architecture.md), which is built
into the MkDocs site by [`docs/build_docs.sh`](build_docs.sh) and mirrored
into the docs website portal (see [`docs/mkdocs.yml`](mkdocs.yml)'s `nav:`).

Architecture Decision Records for specific, hard-to-reverse choices live
under [`docs/adr/`](adr/).
