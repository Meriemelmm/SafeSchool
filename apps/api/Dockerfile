# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root metadata and package files for all relevant workspaces
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies for the workspace
RUN npm install

# Copy source code for the shared package and the API
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build the API
# This will also ensure that any dependencies in 'shared' are handled via the monorepo setup
RUN npm run build -w api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from the builder stage
# We copy the node_modules and the built code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/package*.json ./

# Set environment variables (can be overridden by Docker Compose)
ENV NODE_ENV=production
ENV PORT=3001

# Expose the API port
EXPOSE 3001

# Run the app
CMD ["npm", "run", "start:prod", "-w", "api"]
