# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# 1. Copy static files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 2. Create a dynamic Nginx configuration file
# This ensures Nginx listens on the port assigned by Cloud Run ($PORT or 8080)
RUN printf 'server {\n\
    listen 8080;\n\
    server_name localhost;\n\
    location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    try_files $uri $uri/ /index.html;\n\
    }\n\
    }' > /etc/nginx/conf.d/default.conf

# 3. Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
