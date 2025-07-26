FROM node:20-alpine AS build

WORKDIR /usr/src/app

ARG REACT_APP_API_URL
ARG REACT_APP_VERSION

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_VERSION=$REACT_APP_VERSION

# Installation de pnpm
RUN npm install -g pnpm

# Copie des fichiers de dépendances, y compris pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances en utilisant pnpm avec le fichier de verrouillage
RUN pnpm install --frozen-lockfile

# Copie du reste des fichiers du projet
COPY . .

# Construction de l'application
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:alpine3.18

# Nettoyage du répertoire par défaut de nginx
RUN rm -rf /etc/nginx/html/*

# Copie des fichiers construits et configuration de nginx
COPY --from=build --chown=nginx:nginx /usr/src/app/build /etc/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# echo "$TOKEN" | docker login registry.gitlab.com -u baptiste.bronsin --password-stdin

# PROD
# docker build -t registry.gitlab.com/plannify-group/plannify-front-web-user:1.0.1 . --build-arg REACT_APP_API_URL=https://api.plannify.be --build-arg REACT_APP_VERSION=1.0.1
# docker push registry.gitlab.com/plannify-group/plannify-front-web-user:1.0.1

# DEV
# docker build -t registry.gitlab.com/plannify-group/plannify-front-web-user:0.1.27-staging . --build-arg REACT_APP_API_URL=https://dev-api.plannify.be --build-arg REACT_APP_VERSION=1.0.19
# docker push registry.gitlab.com/plannify-group/plannify-front-web-user:0.1.27-staging