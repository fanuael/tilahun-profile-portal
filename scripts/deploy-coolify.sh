#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed on this host. Install Docker first and retry." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is not available. Install Docker Compose and retry." >&2
  exit 1
fi

if [ ! -f .env ]; then
  if [ -f .env.production.example ]; then
    cp .env.production.example .env
    echo "Created .env from .env.production.example. Edit it before continuing." >&2
  else
    echo "No .env file found and no .env.production.example was provided." >&2
    exit 1
  fi
fi

if ! docker compose config >/dev/null 2>&1; then
  echo "The Docker Compose configuration is invalid. Check your environment values." >&2
  exit 1
fi

echo "Building and starting the application..."
docker compose up -d --build

echo "Deployment started. Checking services..."
docker compose ps
