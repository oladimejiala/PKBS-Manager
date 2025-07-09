# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only what's needed first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Create simplified verification script
RUN printf '#!/bin/sh\n\
echo "=== VERIFICATION STAGE ==="\n\
\n\
# Check if auth file exists (accepting either .js or .jsx)\n\
if [ ! -f "src/services/auth.js" ] && [ ! -f "src/services/auth.jsx" ]; then\n\
  echo "ERROR: Missing auth service file (expected src/services/auth.js or auth.jsx)"\n\
  ls -la src/services/\n\
  exit 1\n\
fi\n\
\n\
# Check FingerprintScanner (accepting either .js or .jsx)\n\
if [ ! -f "src/components/common/FingerprintScanner.jsx" ] && [ ! -f "src/components/common/FingerprintScanner.js" ]; then\n\
  echo "ERROR: Missing FingerprintScanner (expected .jsx or .js)"\n\
  ls -la src/components/common/\n\
  exit 1\n\
fi\n\
\n\
# Quick import checks (warn only)\n\
grep -r "from '\''../services/authService" src/ && echo "WARNING: Found old authService imports" || true\n\
grep -r "from '\''../../services" src/ && echo "WARNING: Found deep imports" || true\n\
\n\
echo "=== VERIFICATION PASSED ==="\n' > /verify.sh && chmod +x /verify.sh

# Run the verification script
RUN /verify.sh

# Build the app
RUN npm run build

# Final stage - production image
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1