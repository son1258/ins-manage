#!/bin/sh
set -e

printf 'window.__RUNTIME_CONFIG__ = {\n  BASE_URL: "%s",\n  APP_ENV: "%s"\n};\n' \
  "${BASE_URL:-}" \
  "${APP_ENV:-production}" \
  > /usr/src/app/public/runtime-config.js

echo "[entrypoint] Generated runtime-config.js:"
cat /usr/src/app/public/runtime-config.js

exec "$@"