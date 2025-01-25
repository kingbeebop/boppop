# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source and env files
COPY . .

# Set environment variables for build time
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

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
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=http://localhost:8080/api

EXPOSE 3000

# Use a shell to ensure environment variables are available
CMD ["sh", "-c", "npx ts-node server.ts"]

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Install wget for healthcheck
RUN apk add --no-cache wget