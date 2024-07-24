# build
FROM node:20-alpine AS builder

RUN corepack enable

ENV NODE_ENV=build

USER node
WORKDIR /home/node

COPY package*.json ./

COPY pnpm-lock.yaml ./

RUN pnpm install

COPY --chown=node:node . .

RUN pnpm run build

# production

FROM node:20-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/main.js"]