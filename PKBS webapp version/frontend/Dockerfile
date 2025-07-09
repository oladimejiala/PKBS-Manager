# Stage 1: Build React app
FROM node:18-alpine AS builder

# Install essential build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 1. First copy ONLY package files
COPY package.json package-lock.json ./

# 2. Install ALL dependencies (force devDependencies)
RUN npm install --production=false --legacy-peer-deps --force

# 3. Verify react-scripts installation
RUN npm list react-scripts && \
    ls -la node_modules/react-scripts

# 4. Copy remaining source files
COPY . .

# 5. Verify authSlice exists
RUN test -f src/store/slices/authSlice.js || (echo "Error: authSlice.js missing!" && exit 1)

# 6. Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]