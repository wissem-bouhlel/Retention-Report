# Stage 1: Build TypeScript
FROM node:20-alpine AS build

WORKDIR /app

# Install deps to compile TS
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Stage 2: Final image - clean environment
FROM node:20-alpine

WORKDIR /app

# Reinstall ONLY production deps with correct native bindings
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled app and SQLite DB
COPY --from=build /app/dist ./dist
COPY --from=build /app/salon.sqlite ./salon.sqlite

EXPOSE 3000

CMD ["node", "dist/index.js"]
