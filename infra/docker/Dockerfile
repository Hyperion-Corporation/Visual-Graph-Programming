# Placeholder multi-stage build for an optionally-hosted instance of VGP's
# Python backend (backend/): the MCP server / Graph-RAG sidecar that
# normally runs as a local subprocess of the Tauri app. Only needed if you
# want a shared, always-on instance instead of the per-user local sidecar.
# backend/ has no source tree yet (just backend/pyproject.toml) — fill in
# the COPY/RUN lines below once it's scaffolded, or delete infra/docker/
# entirely if you never need a hosted backend.

FROM python:3.12-slim AS build
WORKDIR /src
COPY pyproject.toml uv.lock ./
COPY backend/ backend/
RUN pip install --no-cache-dir uv && uv sync --frozen --no-dev

FROM python:3.12-slim AS runtime
WORKDIR /app
RUN useradd -m -s /bin/bash appuser
COPY --from=build /src/.venv /app/.venv
COPY --from=build /src/backend /app/backend
ENV PATH="/app/.venv/bin:${PATH}"
COPY infra/docker/entrypoint.sh /app/entrypoint.sh
USER appuser
EXPOSE 8765
ENTRYPOINT ["/app/entrypoint.sh"]
# CMD ["python", "-m", "backend.mcp_server"]
