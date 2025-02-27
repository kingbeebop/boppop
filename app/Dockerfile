# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Set environment variables for build time
ARG HOST_IP
ARG FRONTEND_PORT
ARG API_BASE_URL
ARG API_URL

ENV NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_API_URL=${API_URL}

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Install health check dependencies
RUN apk add --no-cache wget curl

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set environment variables for runtime
ENV NODE_ENV=production
ENV HOST_IP=${HOST_IP}
ENV FRONTEND_PORT=${FRONTEND_PORT}
ENV NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_API_URL=${API_URL}

EXPOSE ${FRONTEND_PORT}

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${FRONTEND_PORT}/api/health || exit 1

# Start the server
CMD ["npx", "ts-node", "server.ts"]