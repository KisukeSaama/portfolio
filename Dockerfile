FROM node:24-alpine AS development
WORKDIR /workspace
ENV NODE_ENV=development NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
# `--ignore-scripts` because no dependency here needs a build step: the only three packages that
# declare install scripts are `fsevents` (macOS only) and `unrs-resolver` (an ESLint resolver), and
# an install script is the shortest path a compromised package has to arbitrary code in the image.
RUN npm ci --ignore-scripts
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

FROM node:24-alpine AS build
WORKDIR /workspace
ARG PUBLIC_SITE_URL=http://localhost:3000
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL NEXT_TELEMETRY_DISABLED=1 NEXT_STANDALONE=true
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN addgroup -S portfolio && adduser -S portfolio -G portfolio
COPY --from=build --chown=portfolio:portfolio /workspace/.next/standalone ./
COPY --from=build --chown=portfolio:portfolio /workspace/.next/static ./.next/static
COPY --from=build --chown=portfolio:portfolio /workspace/public ./public
USER portfolio
EXPOSE 3000
CMD ["node", "server.js"]
