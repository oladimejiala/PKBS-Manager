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
# Verification step
RUN ls -la node_modules/react-scripts/package.json && \
    if [ ! -f src/pages/Login.js ] || \
       [ ! -f src/store/slices/authSlice.js ] || \
       [ ! -f src/services/auth.jsx ] || \
       [ ! -f src/components/common/FingerprintScanner.jsx ]; then \
        echo "Missing required files!"; \
        find src -type f; \
        exit 1; \
    else \
        echo "All required files verified successfully!"; \
    fi
# Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]