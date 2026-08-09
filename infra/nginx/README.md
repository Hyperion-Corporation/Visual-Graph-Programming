# nginx/

Standalone nginx configs for serving a static docs/site export, as an
alternative to the docker-compose stack under `infra/docker/`. Whether this
serves `docs/website/`'s build output depends on what that site ends up
being — update the paths below to match once that's settled.

## Files

| Path | Purpose |
| --- | --- |
| `nginx.conf` | Main process config (gzip, logging, includes `conf.d/`) |
| `conf.d/site.conf` | Virtual host: static export + SPA/static-site `try_files` fallback |
| `conf.d/reverse-proxy.conf.example` | Sample reverse-proxy vhost in front of an upstream |

## Quick start (container)

```bash
npm run build
docker run --rm -p 8080:80 \
  -v "$PWD/out:/usr/share/nginx/html:ro" \
  -v "$PWD/infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$PWD/infra/nginx/conf.d:/etc/nginx/conf.d:ro" \
  nginx:1.27-alpine
```

Visit `http://localhost:8080`.
