#!/bin/bash
set -e

echo "Starting production environment..."
docker compose -f docker-compose.prod.yml up -d