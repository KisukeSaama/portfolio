FROM node:24-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm ci --workspace frontend
COPY frontend ./frontend
RUN npm --prefix frontend run build && npm prune --omit=dev

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app
RUN addgroup -S portfolio && adduser -S portfolio -G portfolio
COPY --from=build --chown=portfolio:portfolio /workspace/node_modules ./node_modules
COPY --from=build --chown=portfolio:portfolio /workspace/frontend/build ./build
COPY --from=build --chown=portfolio:portfolio /workspace/frontend/package.json ./package.json
USER portfolio
EXPOSE 3000
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]
