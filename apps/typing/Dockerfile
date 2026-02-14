FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/typing/package.json ./apps/typing/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/typing/node_modules ./apps/typing/node_modules

# Copy source
COPY . .

# Build typing app
WORKDIR /app/apps/typing
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 typing

# Copy standalone build
COPY --from=builder /app/apps/typing/.next/standalone ./
COPY --from=builder /app/apps/typing/.next/static ./apps/typing/.next/static
COPY --from=builder /app/apps/typing/public ./apps/typing/public

USER typing

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/typing/server.js"]
