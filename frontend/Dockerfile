FROM node:24-alpine AS build
WORKDIR /workspace
ARG PUBLIC_SITE_URL=http://localhost:3000
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL NEXT_TELEMETRY_DISABLED=1 NEXT_STANDALONE=true
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm ci --workspace frontend
COPY frontend ./frontend
RUN npm --prefix frontend run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/frontend
RUN addgroup -S portfolio && adduser -S portfolio -G portfolio
COPY --from=build --chown=portfolio:portfolio /workspace/frontend/.next/standalone /app
COPY --from=build --chown=portfolio:portfolio /workspace/frontend/.next/static ./.next/static
COPY --from=build --chown=portfolio:portfolio /workspace/frontend/public ./public
USER portfolio
EXPOSE 3000
CMD ["node", "server.js"]
