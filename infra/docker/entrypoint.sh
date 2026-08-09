#!/usr/bin/env bash
# GrafeoDB is embedded (in-process, no client/server), so there is no
# external database to wait for here -- this just exec's the container
# command directly. Kept as a separate entrypoint script so future
# start-up preconditions (e.g. warming a shared vector index) have a
# natural place to live.
set -euo pipefail

exec "$@"
