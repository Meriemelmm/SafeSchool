# Use Node.js as the base image for building
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root metadata and package files for relevant workspaces
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies for the workspace
RUN npm install

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Set environment variables for build if needed (e.g., API URL)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the web application
RUN npm run build -w web

# Final stage for production
FROM node:20-alpine

WORKDIR /app

# Copy built app and dependencies
# In this monorepo structure, we need root node_modules and web app files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package*.json ./apps/web/
COPY --from=builder /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose frontend port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "run", "start", "-w", "web"]
