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
RUN echo "Verifying required files..." && \
    REQUIRED_FILES="\
      src/pages/Login.js \
      src/store/slices/authSlice.js \
      src/store/slices/transactionSlice.js \
      src/services/auth.jsx \
      src/components/common/FingerprintScanner.jsx" && \
    for file in $REQUIRED_FILES; do \
      if [ ! -f "$file" ]; then \
        echo "Error: Missing required file - $file"; \
        echo "Existing files in directory:"; \
        find "$(dirname "$file")" -type f | sed 's/^/  /'; \
        exit 1; \
      fi; \
    done && \
    echo "All required files verified successfully!"
# Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]