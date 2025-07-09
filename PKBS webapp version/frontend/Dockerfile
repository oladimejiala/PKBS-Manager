# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Create verification script as separate file to avoid quoting issues
RUN echo $'#!/bin/sh\n\
echo "=== VERIFICATION STAGE ==="\n\
\n\
echo "1/6 Checking critical files..."\n\
critical_files="src/pages/Login.js src/services/auth.jsx src/components/common/FingerprintScanner.jsx"\n\
for file in $critical_files; do\n\
  if [ ! -f "$file" ]; then\n\
    echo "ERROR: Missing $file"\n\
    echo "Directory contents:"; ls -la "$(dirname "$file")"\n\
    exit 1\n\
  fi\n\
done\n\
\n\
echo "2/6 Checking Redux slices..."\n\
slices="authSlice.js transactionSlice.js salesSlice.js logisticsSlice.js factorySlice.js sourcingSlice.js"\n\
for slice in $slices; do\n\
  if [ ! -f "src/store/slices/$slice" ]; then\n\
    echo "ERROR: Missing slice: $slice"\n\
    echo "Existing slices:"; ls -la src/store/slices/\n\
    exit 1\n\
  fi\n\
done\n\
\n\
echo "3/6 Checking deep imports..."\n\
if bad_imports=$(grep -r "from \\.\\./\\.\\./" src/); then\n\
  echo "ERROR: Deep imports found:"\n\
  echo "$bad_imports"\n\
  echo "Update imports to use proper module paths"\n\
  exit 1\n\
fi\n\
\n\
echo "4/6 Checking authService imports..."\n\
if auth_imports=$(grep -r "from \'\\.\\./services/authService" src/ || grep -r "from \"\\.\\./services/authService" src/); then\n\
  echo "ERROR: Found deprecated authService imports:"\n\
  echo "$auth_imports"\n\
  echo "Update all authService imports to: from '\"../services/auth\"'\n\
  echo "Run this fix command: find src/ -type f -exec sed -i \\"s|from \\\"\\\'\\\\.\\\\./services/authService\\\"\\\'|from \\\"\\\'../services/auth\\\"\\\'|g\\" {} +"\n\
  exit 1\n\
fi\n\
\n\
echo "5/6 Verifying service imports..."\n\
if service_imports=$(grep -r "from \'\\.\\./\\.\\./services" src/ || grep -r "from \"\\.\\./\\.\\./services" src/); then\n\
  echo "ERROR: Invalid service imports found:"\n\
  echo "$service_imports"\n\
  echo "Update all service imports to use correct relative paths"\n\
  echo "Run this fix command: find src/ -type f -exec sed -i \\"s|from \\\"\\\'\\\\.\\\\./\\\\.\\\\./services|from \\\"\\\'../services|g\\" {} +"\n\
  exit 1\n\
fi\n\
\n\
echo "6/6 Verifying FingerprintScanner..."\n\
if [ ! -f "src/components/common/FingerprintScanner.jsx" ]; then\n\
  echo "ERROR: FingerprintScanner.jsx missing"\n\
  ls -la src/components/common/\n\
  exit 1\n\
fi\n\
\n\
echo "=== VERIFICATION PASSED ==="\n\
' > /verify.sh && chmod +x /verify.sh

# Run verification then build
RUN /verify.sh && \
    echo "=== BUILD STAGE ===" && \
    npm install && \
    npm run build && \
    echo "=== BUILD SUCCESSFUL ==="

# Final stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]