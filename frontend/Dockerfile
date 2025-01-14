FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

ENV PUBLIC_CORBADO_PROJECT_ID=
ENV PUBLIC_CORBADO_SUPPORT_MAIL=

RUN bun i

RUN bun run build

FROM oven/bun:alpine AS runner
RUN bun i -g serve

WORKDIR /app

COPY --from=builder /app/build .

CMD ["bun", "x", "serve", "-s", ".", "-l", "80", "--no-port-switching"]

EXPOSE 80
