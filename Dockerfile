# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Run Express Backend & Serve Static Frontend
# ==========================================
FROM node:18-alpine
WORKDIR /app

# Install native dependencies for sqlite3
RUN apk add --no-cache python3 make g++

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend files and precalculated Big Data assets
COPY backend/ ./backend/
COPY dataset/ ./dataset/

# Copy compiled React frontend assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Environment configurations
ENV PORT=8080
ENV NODE_ENV=production
ENV DATABASE_URL=/app/data/cineai.db
ENV JWT_SECRET=supersecret_cineai_production_key_9824
ENV TMDB_API_KEY=4e44d9029b1270a757cddc766a1bcb63

VOLUME ["/app/data"]

EXPOSE 8080

# Start server
CMD ["node", "backend/index.js"]
