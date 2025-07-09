# Stage 1: Build React app
FROM node:18-alpine AS builder

# 1. Install essential build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 2. Copy ONLY package files first
COPY package.json package-lock.json ./

# 3. Install react-scripts FIRST as explicit dependency
RUN npm install react-scripts@5.0.1 --save-exact --legacy-peer-deps

# 4. Install all other dependencies
RUN npm install --production=false --legacy-peer-deps

# 5. Verify react-scripts is properly installed
RUN ls -la node_modules/.bin/react-scripts && \
    npm list react-scripts

# 6. Copy remaining source files
COPY . .

# 7. Build React app
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]