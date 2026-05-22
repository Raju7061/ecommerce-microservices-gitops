# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the production assets using Nginx
FROM nginx:alpine
# Copy custom build assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Expose port 80 inside the container (K8s will map this)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]