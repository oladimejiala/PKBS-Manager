# Stage 1: Build React app
FROM node:18-alpine AS builder

# Install essential build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 1. Copy package files first
COPY package.json package-lock.json ./

# 2. Install dependencies (include devDependencies)
RUN npm install --production=false --legacy-peer-deps

# 3. Verify critical files exist
RUN ls -la node_modules/.bin/react-scripts && \
    test -f src/pages/Login.js || (echo "Error: Login.js missing!" && exit 1)

# 4. Copy all source files
COPY . .

# 5. Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]