FROM node:20.19.1-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN apk add --no-cache python3 make g++  # required to build better-sqlite3 native addon
RUN yarn install --frozen-lockfile

COPY . .

ARG GIT_BRANCH=main
ENV GIT_BRANCH=$GIT_BRANCH

RUN yarn build

FROM node:20.19.1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    apk add --no-cache su-exec

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN mkdir -p /app/data
ENV DATA_DIR=/app/data

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
