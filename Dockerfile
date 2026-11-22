FROM node:20-alpine

WORKDIR /app

# Copie des définitions de packages
COPY package*.json ./

# Installation des dépendances de production
RUN npm ci --only=production

# Copie des fichiers source et publics
COPY src/ ./src/
COPY public/ ./public/

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]
