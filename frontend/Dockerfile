FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun i

RUN apk add --no-cache nodejs

RUN bun run build

FROM oven/bun:alpine AS runner
RUN bun i -g serve

WORKDIR /app

COPY --from=builder /app/dist/expensy-fe/browser .

CMD ["bun", "x", "serve", "-s", ".", "-l", "80", "--no-port-switching"]

EXPOSE 80
