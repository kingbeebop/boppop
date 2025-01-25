FROM python:3.11-slim as builder

# Install system dependencies including PostgreSQL client
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_HOME=/opt/poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy only requirements to cache them in docker layer
WORKDIR /api2
COPY poetry.lock pyproject.toml /api2/

# Install dependencies (without dev dependencies)
RUN poetry install --only main --no-root

# Copy project
COPY . /api2/

# Make scripts executable
RUN chmod +x /api2/scripts/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/api2/scripts/entrypoint.sh"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1