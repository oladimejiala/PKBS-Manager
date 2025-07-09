# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Create and run verification in a single RUN command
RUN set -e && \
    cat <<'EOF' > /verify.sh && \
    chmod +x /verify.sh && \
    /verify.sh && \
    echo "=== BUILD STAGE ===" && \
    npm install && \
    npm run build && \
    echo "=== BUILD SUCCESSFUL ==="
#!/bin/sh
echo "=== VERIFICATION STAGE ==="

echo "1/6 Checking critical files..."
critical_files="src/pages/Login.js src/services/auth.js src/components/common/FingerprintScanner.jsx"
for file in $critical_files; do
  if [ ! -f "$file" ]; then
    echo "ERROR: Missing $file"
    echo "Directory contents:"; ls -la "$(dirname "$file")"
    exit 1
  fi
done

echo "2/6 Checking Redux slices..."
slices="authSlice.js transactionSlice.js salesSlice.js logisticsSlice.js factorySlice.js sourcingSlice.js"
for slice in $slices; do
  if [ ! -f "src/store/slices/$slice" ]; then
    echo "ERROR: Missing slice: $slice"
    echo "Existing slices:"; ls -la src/store/slices/
    exit 1
  fi
done

echo "3/6 Checking deep imports..."
if bad_imports=$(grep -r "from \\.\\./\\.\\./" src/); then
  echo "ERROR: Deep imports found:"
  echo "$bad_imports"
  echo "Update imports to use proper module paths"
  exit 1
fi

echo "4/6 Checking authService imports..."
if auth_imports=$(grep -r "from ['\"]\\.\\./services/authService" src/); then
  echo "ERROR: Found deprecated authService imports:"
  echo "$auth_imports"
  echo "Update to: from '../services/auth'"
  echo "Run: find src/ -type f -exec sed -i \"s|from ['\"]\\.\\./services/authService['\"]|from '../services/auth'|g\" {} +"
  exit 1
fi

echo "5/6 Verifying service imports..."
if service_imports=$(grep -r "from ['\"]\\.\\./\\.\\./services" src/); then
  echo "ERROR: Invalid service imports found:"
  echo "$service_imports"
  echo "Update to: from '../services'"
  echo "Run: find src/ -type f -exec sed -i \"s|from ['\"]\\.\\./\\.\\./services['\"]|from '../services'|g\" {} +"
  exit 1
fi

echo "6/6 Verifying FingerprintScanner..."
if [ ! -f "src/components/common/FingerprintScanner.jsx" ]; then
  echo "ERROR: FingerprintScanner.jsx missing"
  ls -la src/components/common/
  exit 1
fi

echo "=== VERIFICATION PASSED ==="
EOF

# Final stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]