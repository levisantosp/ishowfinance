FROM oven/bun:1.3.3-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json

RUN bun i

COPY . .

RUN bun push
RUN bun gen

WORKDIR /app/apps/api

RUN bun compile

CMD ["bun", "start"]