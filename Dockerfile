FROM node:21.1.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY public ./public
COPY src ./src
COPY knexfile.ts ./
COPY scripts/entrypoint.sh ./scripts/entrypoint.sh
COPY scripts/wait-for-it.sh ./scripts/wait-for-it.sh

RUN npm run build && \
  npm prune --production


FROM node:21.1.0-slim

WORKDIR /app

RUN useradd -m core


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/knexfile.ts ./
COPY --from=builder /app/scripts/entrypoint.sh ./scripts/entrypoint.sh
COPY --from=builder /app/scripts/wait-for-it.sh ./scripts/wait-for-it.sh


RUN chown -R core:core /app
RUN chmod +x ./scripts/entrypoint.sh ./scripts/wait-for-it.sh
USER core

ENV PORT 3000
EXPOSE $PORT

ENTRYPOINT ["./scripts/entrypoint.sh"]
