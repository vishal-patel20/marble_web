# ====================================
# Stage 1: Builder
# ====================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# ====================================
# Stage 2: Production Runtime
# ====================================
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nodeuser

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

# Create uploads directory
RUN mkdir -p uploads && chown -R nodeuser:nodejs uploads

# Switch to non-root user
USER nodeuser

EXPOSE 5000

# Use dumb-init to handle PID 1 signals correctly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
