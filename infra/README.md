# infra/

Infrastructure-as-code and edge configs for `Visual-Graph-Programming`.
Everything here is **optional**: VGP's three deployment surfaces (VS Code
Marketplace, Tauri desktop installers, Unreal plugin distribution) need
none of it. This exists only if you want to run `backend/`'s MCP/Graph-RAG
server as a shared, always-on service instead of a per-user local sidecar,
or to self-host a static docs/site build.

| Directory | Purpose |
| --- | --- |
| [`docker/`](docker/) | Containerize the optionally-hosted backend (Dockerfile, docker-compose) |
| [`ansible/`](ansible/) | Provision a bare-metal/VM host for the backend outside the container world |
| [`terraform/`](terraform/) | Placeholder cloud provisioning (registry, cluster) for the backend — no provider wired up yet |
| [`nginx/`](nginx/) | Standalone nginx config for serving a static docs/site export |

Pick what you actually need — e.g. `docker/` alone is enough for a local or
single-host deployment; `ansible/`/`terraform/` only matter once you're
provisioning real infrastructure for it.
