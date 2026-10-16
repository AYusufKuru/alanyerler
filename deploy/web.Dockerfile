FROM node:22-bookworm-slim AS website
WORKDIR /src
COPY ["alan_yerlerwebsite/package.json", "alan_yerlerwebsite/package-lock.json", "./"]
RUN npm ci
COPY ["alan_yerlerwebsite/index.html", "alan_yerlerwebsite/vite.config.js", "./"]
COPY ["alan_yerlerwebsite/src", "./src"]
COPY ["alan_yerlerwebsite/public", "./public"]
ENV VITE_API_URL=same-origin
RUN npm run build

FROM node:22-bookworm-slim AS admin
WORKDIR /src
COPY admin/package.json admin/package-lock.json ./
RUN npm ci
COPY admin/index.html admin/vite.config.ts admin/tsconfig.json admin/tsconfig.app.json admin/tsconfig.node.json ./
COPY admin/src ./src
COPY admin/public ./public
RUN npx tsc -b && npx vite build --base=/panel/

FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=website /src/dist /usr/share/nginx/html
COPY --from=admin /src/dist /usr/share/nginx/html/panel
