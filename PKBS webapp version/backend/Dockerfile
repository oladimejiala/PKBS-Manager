# Use official Node.js LTS image
FROM node:18-alpine

# Create and set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Create non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Start command using node instead of npm for better signal handling
CMD ["node", "server.js"]