FROM node:24.11.1-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY prisma /app/prisma

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm prisma db push
RUN pnpm prisma generate
RUN pnpm build

CMD ["pnpm", "start"]