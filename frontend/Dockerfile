FROM node:22-alpine as builder
RUN npm i -g bun

WORKDIR /app

COPY . .

RUN bun i

RUN bun run build

FROM node:22-alpine as runner
RUN npm i -g bun

WORKDIR /app

COPY --from=builder /app/build .

RUN bun i -g serve

CMD ["serve", "-s", ".", "-l", "80", "--no-port-switching"]

EXPOSE 80

