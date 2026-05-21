# ── Production Dockerfile for Backend (Express + Mongoose) ──

FROM node:22-alpine AS base

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# ── Install production dependencies ──
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Copy application source ──
COPY . .

# Ensure uploads directories exist
RUN mkdir -p uploads/audio uploads/invitations uploads/profile_pics \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# Health check against the built-in /healthz endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:5000/healthz || exit 1

CMD ["node", "server.mjs"]
