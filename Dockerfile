# ---- Base ----
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock prisma ./
RUN bun install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN DATABASE_URL=$DATABASE_URL bun run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["bun", "server.js"]