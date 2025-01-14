FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

ENV PUBLIC_CORBADO_PROJECT_ID=
ENV PUBLIC_CORBADO_SUPPORT_MAIL=

RUN bun i
RUN bun i -g serve

RUN bun run build

CMD ["bun", "x", "serve", "-s", "/app/build/", "-l", "80", "--no-port-switching"]

EXPOSE 80
