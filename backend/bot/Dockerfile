FROM node:18-alpine

WORKDIR /app

COPY bot/package*.json ./
RUN npm install

COPY bot ./
COPY deployments ./deployments
COPY artifacts ./artifacts

ENV NODE_ENV=production
CMD ["node", "index.js"]


