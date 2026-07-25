#!/bin/sh
set -e

echo "[entrypoint] waiting for database..."

if [ "${DATABASE_URL-}" ]; then
  while ! python -c "import os, sys; import urllib.parse as up; from urllib.parse import urlparse; import psycopg2; url = os.environ['DATABASE_URL']; parsed = urlparse(url); conn = psycopg2.connect(dbname=parsed.path.lstrip('/'), user=parsed.username, password=parsed.password, host=parsed.hostname, port=parsed.port); conn.close()" 2>/dev/null; do
    echo "[entrypoint] database unavailable, sleeping..."
    sleep 2
  done
fi

echo "[entrypoint] running migrations..."
python manage.py migrate --noinput

echo "[entrypoint] collecting static files..."
python manage.py collectstatic --noinput

exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4 --log-level info --timeout 120
