#!/bin/bash

# Ensure script fails on any error
set -e

# Create necessary directories
mkdir -p nginx/logs

# Down any existing containers
docker compose down

# Build and start services
docker compose up --build -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Check service health
docker compose ps

echo "Services are running at http://167.172.251.135:8080" 