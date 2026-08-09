# Docker

> **Optional.** VGP's Python backend (`backend/`) normally runs as a local
> subprocess of the Tauri app, communicating over stdio/WebSocket — this
> exists only if you want a shared, always-on instance instead (e.g. a
> team-wide Graph-RAG/MCP server). Delete `infra/docker/` entirely if you
> never need that.

## Quick start

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

## Files

| File | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage build for the backend (`backend/`, via uv) — placeholder until `backend/` has a source tree beyond `backend/pyproject.toml` |
| `docker-compose.yml` | Local dev stack: just the backend, exposing its WebSocket/MCP port |
| `docker-compose.prod.yml` | Production overrides (apply with `-f infra/docker/docker-compose.yml -f infra/docker/docker-compose.prod.yml`) |
| `entrypoint.sh` | Execs the container command directly — GrafeoDB is embedded (in-process), so there's no external database to wait for |

## Notes

- Build context is the **repository root** — the Dockerfile expects `backend/` to have real source under it (currently just `backend/pyproject.toml`). Fill in the `COPY`/`CMD` lines once it's scaffolded.
- The extension/app talk to this backend only through the documented WebSocket/MCP protocol — never bundle credentials into the VS Code extension or the Tauri app bundle.
