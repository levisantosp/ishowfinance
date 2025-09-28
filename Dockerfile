FROM node:lts-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY prisma /app/prisma

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build
RUN pnpm prisma db push

CMD [ "pnpm", "start" ]