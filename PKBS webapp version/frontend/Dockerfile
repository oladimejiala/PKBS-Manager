# Stage 1: Build React app
FROM node:18-alpine AS builder

# Install build tools (required for some dependencies)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 1. Copy package files first for caching
COPY package.json package-lock.json ./

# 2. Install ALL dependencies including devDependencies
RUN npm ci --production=false --legacy-peer-deps

# 3. Verify critical files exist
RUN ls -la node_modules/.bin/react-scripts && \
    ls -la src/store/slices/authSlice.* || (echo "Error: Missing authSlice!" && exit 1)

# 4. Copy remaining files
COPY . .

# 5. Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]