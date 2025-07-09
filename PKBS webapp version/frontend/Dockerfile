# Stage 1: Build React app
FROM node:18-alpine AS builder

# Install build essentials
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install --production=false --legacy-peer-deps --force

# Copy all source files
COPY . .

# Verify critical files exist
RUN ls -la node_modules/react-scripts/package.json && \
    test -f src/pages/Login.js && \
    test -f src/store/slices/authSlice.js && \
    test -f src/services/auth.js && \
    test -f src/common/FingerprintScanner.js || \
    (echo "Missing required files!" && find src -type f && exit 1)

# Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]