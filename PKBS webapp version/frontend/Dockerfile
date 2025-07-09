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
    # 3. Verify import paths (comprehensive check)
    echo "Checking import paths..." && \
    if grep -r "from '\\.\\./\\.\\./" src/; then \
      echo "ERROR: Invalid deep imports found (fix paths to stay within src/):"; \
      grep -r "from '\\.\\./\\.\\./" src/ | while read -r line; do \
        file=$(echo "$line" | cut -d: -f1); \
        import=$(echo "$line" | cut -d: -f2-); \
        echo "  $file: $import"; \
      done; \
      echo "Tip: Change '../../services/' to '../services/'"; \
      exit 1; \
    fi && \
    \
    # 4. Check for specific broken imports
    echo "Checking for broken service imports..." && \
    if grep -r "from '\\.\\./services/authService" src/; then \
      echo "ERROR: Found imports from non-existent authService"; \
      echo "Affected files:"; \
      grep -r -l "from '\\.\\./services/authService" src/ | while read -r file; do \
        echo "  $file"; \
      done; \
      echo "Solution: Update imports to use '../services/auth' instead"; \
      exit 1; \
    fi && \
    \
    # 5. Verify FingerprintScanner component exists
    echo "Verifying FingerprintScanner component..." && \
    if [ ! -f "src/components/common/FingerprintScanner.jsx" ]; then \
      echo "ERROR: FingerprintScanner component missing!"; \
      echo "Expected location: src/components/common/FingerprintScanner.jsx"; \
      echo "Existing common components:"; \
      ls -la src/components/common/; \
      exit 1; \
    fi && \
    \
    echo "=== ALL files and imports verified successfully! ==="