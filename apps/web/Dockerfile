FROM oven/bun:1.3.3-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json

RUN bun i --frozen-lockfile

COPY . .

RUN bun --env-file=.env prisma db push
RUN bun --env-file=.env prisma generate

WORKDIR /app/apps/web

RUN bun compile

CMD ["bun", "start"]