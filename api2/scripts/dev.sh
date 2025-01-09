#!/bin/bash
set -e

echo "Starting development environment..."
docker compose -f docker-compose.yml up --build