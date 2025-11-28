FROM oven/bun:1.3.3-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json

RUN bun i

COPY . .

RUN bun push
RUN bun gen

WORKDIR /app/apps/web

RUN bun compile

CMD ["bun", "start"]