# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve app with nginx
FROM nginx:alpine
# Copy nginx config from frontend directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]