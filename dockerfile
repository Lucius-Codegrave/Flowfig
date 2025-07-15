FROM node:20-slim

RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get install -y build-essential && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@8.10.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml* package.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

CMD ["pnpm", "dev", "--poll"]
