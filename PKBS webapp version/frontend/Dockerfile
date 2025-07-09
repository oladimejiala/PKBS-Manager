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
# File verification - add this before the build step
# Combined verification step
# Combined verification step
RUN echo "=== Verifying ALL required files and imports ===" && \
    \
    # 1. Verify application files
    echo "Checking application files..." && \
    APP_FILES="\
      src/pages/Login.js \
      src/services/auth.jsx \
      src/components/common/FingerprintScanner.jsx" && \
    for file in $APP_FILES; do \
      if [ ! -f "$file" ]; then \
        echo "ERROR: Missing critical application file - $file"; \
        echo "Existing files in directory:"; \
        find "$(dirname "$file")" -type f | sed 's/^/  /'; \
        exit 1; \
      fi; \
    done && \
    \
    # 2. Verify Redux slices
    echo "Checking Redux store slices..." && \
    STORE_SLICES="\
      authSlice.js \
      transactionSlice.js \
      salesSlice.js \
      logisticsSlice.js \
      factorySlice.js \
      sourcingSlice.js" && \
    for slice in $STORE_SLICES; do \
      if [ ! -f "src/store/slices/$slice" ]; then \
        echo "ERROR: Missing required Redux slice - $slice"; \
        echo "Existing slices:"; \
        ls -la src/store/slices/; \
        exit 1; \
      fi; \
    done && \
    \
    # 3. Verify import paths
    echo "Checking import paths..." && \
    if grep -r "from '../../" src/; then \
      echo "ERROR: Found invalid imports pointing outside src/ directory"; \
      echo "Problematic imports:"; \
      grep -r "from '../../" src/ | sed 's/^/  /'; \
      exit 1; \
    fi && \
    \
    echo "=== ALL files and imports verified successfully! ==="

# Build React app
# Modify your build step to:
RUN npm run build || (echo "Build failed - checking warnings..." && exit 1)

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]