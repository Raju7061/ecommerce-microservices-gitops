# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Pehle sirf package files copy karke dependencies install karein
COPY package*.json ./
RUN npm install

# Ab poora code copy karein aur verify karein ki context sahi hai
COPY . .

# [🚨 FIX]: Yeh check karega ki files sahi jagah hain aur build chalayega
RUN ls -la && ls -la public || echo "Checking directories"
RUN npm run build

# Stage 2: Serve the production assets using Nginx
FROM nginx:alpine
# Copy custom build assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Expose port 80 inside the container
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]