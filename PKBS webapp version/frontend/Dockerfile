# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Verification Stage
RUN echo "=== VERIFICATION STAGE ===" && \
    \
    # 1. Check critical files
    echo "1/5 Checking critical files..." && \
    critical_files=(
      "src/pages/Login.js"
      "src/services/auth.jsx"
      "src/components/common/FingerprintScanner.jsx"
    ) && \
    for file in "${critical_files[@]}"; do \
      if [ ! -f "$file" ]; then \
        echo "ERROR: Missing $file"; \
        echo "Directory contents:"; ls -la "$(dirname "$file")"; \
        exit 1; \
      fi; \
    done && \
    \
    # 2. Check Redux slices
    echo "2/5 Checking Redux slices..." && \
    slices=(
      "authSlice.js" 
      "transactionSlice.js"
      "salesSlice.js"
      "logisticsSlice.js" 
      "factorySlice.js"
      "sourcingSlice.js"
    ) && \
    for slice in "${slices[@]}"; do \
      if [ ! -f "src/store/slices/$slice" ]; then \
        echo "ERROR: Missing slice: $slice"; \
        echo "Existing slices:"; ls -la src/store/slices/; \
        exit 1; \
      fi; \
    done && \
    \
    # 3. Check import patterns
    echo "3/5 Checking import patterns..." && \
    if bad_imports=$(grep -r "from '\\.\\./\\.\\./" src/); then \
      echo "ERROR: Deep imports found:"; \
      echo "$bad_imports"; \
      exit 1; \
    fi && \
    \
    # 4. Check authService imports
    echo "4/5 Checking authService imports..." && \
    if auth_imports=$(grep -r "from '\\.\\./services/authService" src/); then \
      echo "ERROR: Found authService imports:"; \
      echo "$auth_imports"; \
      echo "Update to: from '../services/auth'"; \
      exit 1; \
    fi && \
    \
    # 5. Verify FingerprintScanner
    echo "5/5 Verifying FingerprintScanner..." && \
    if [ ! -f "src/components/common/FingerprintScanner.jsx" ]; then \
      echo "ERROR: FingerprintScanner.jsx missing"; \
      ls -la src/components/common/; \
      exit 1; \
    fi && \
    \
    echo "=== VERIFICATION PASSED ==="

# Build Stage
RUN echo "=== BUILD STAGE ===" && \
    npm install && \
    npm run build && \
    echo "=== BUILD SUCCESSFUL ==="

# Final stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]