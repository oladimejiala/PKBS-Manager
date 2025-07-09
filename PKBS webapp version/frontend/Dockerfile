# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# 2. Clean install with legacy peer deps if needed
RUN npm ci --production=false --legacy-peer-deps

COPY . .

# NEW: Verify file exists before build
RUN ls -la src/store/slices/authSlice.* || (echo "AuthSlice missing!" && exit 1)

RUN npm run build

# Stage 2: Serve app with nginx
FROM nginx:alpine
# Copy nginx config from frontend directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]