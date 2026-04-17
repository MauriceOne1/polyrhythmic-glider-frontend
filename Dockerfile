# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (output debug log if it fails)
RUN npm install

RUN npm ci || (cat /root/.npm/_logs/*.log && exit 1)

# Copy source code
COPY . .

# Build the Angular application
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app

# Install a lightweight HTTP server
RUN npm install -g http-server

# Copy built application from builder
COPY --from=builder /app/dist/polyrhythmic-glider-frontend/browser /app

# Expose port 4200 (default Angular dev server port) or 8080 (http-server default)
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4200', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["http-server", "-p", "4200", "-c-1"]