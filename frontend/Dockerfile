FROM oven/bun:alpine as builder

WORKDIR /app
COPY . .

RUN bun i

RUN bun run build

FROM oven/bun:alpine as runner
RUN bun i -g serve

WORKDIR /app

COPY --from=builder /app/build .

CMD ["bun", "x", "serve", "-s", ".", "-l", "80", "--no-port-switching"]

EXPOSE 80
