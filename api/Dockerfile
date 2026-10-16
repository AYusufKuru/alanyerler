FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
ENV DATABASE_URL=postgresql://alanyerler:alanyerler@postgres:5432/alanyerler
RUN npx prisma generate \
  && npm run build \
  && sed -i 's/\r$//' docker-entrypoint.sh \
  && chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
