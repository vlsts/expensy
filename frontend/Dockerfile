FROM oven/bun:debian AS builder

WORKDIR /app
COPY . .

ARG PUBLIC_CORBADO_PROJECT_ID
ARG PUBLIC_CORBADO_SUPPORT_MAIL
ARG PUBLIC_BACKEND_URL
ARG PUBLIC_CORBADO_AUTH_URL

ENV PUBLIC_CORBADO_PROJECT_ID=${PUBLIC_CORBADO_PROJECT_ID}
ENV PUBLIC_CORBADO_SUPPORT_MAIL=${PUBLIC_CORBADO_SUPPORT_MAIL}
ENV PUBLIC_BACKEND_URL=${PUBLIC_BACKEND_URL}
ENV PUBLIC_CORBADO_AUTH_URL={PUBLIC_CORBADO_AUTH_URL}

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install 22
RUN . "$NVM_DIR/nvm.sh" && nvm use 22

RUN bun i
RUN bun run build

FROM oven/bun:debian AS runner

WORKDIR /app
COPY --from=builder /app/build ./build
RUN bun i -g serve

CMD ["bun", "x", "serve", "-s", "/app/build/", "-l", "80", "--no-port-switching"]

EXPOSE 80
