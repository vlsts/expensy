FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun i

RUN bun run build

FROM oven/bun:alpine AS runner
RUN bun i -g serve

ENV DB_HOST=localhost:27017
ENV DB_USERNAME=
ENV DB_PASSWORD=

# Corbado api env variables
ENV CORBADO_API=
ENV FRONTEND_API=
ENV PROJECT_ID=
ENV BACKEND_API=

WORKDIR /app

COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .

RUN bun i

CMD ["bun", "run", "main.js"]

EXPOSE 80
