FROM oven/bun:alpine as builder

WORKDIR /app

COPY . .

RUN apk install --no-cache nodejs

RUN bun i

RUN bun run build

FROM oven/bun:alpine as runner

WORKDIR /app

COPY --from=builder /app/build .

RUN bun i -g serve

CMD ["serve", "-s", ".", "-l", "80", "--no-port-switching"]

EXPOSE 80

