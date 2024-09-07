FROM gplane/pnpm:node20 as builder

WORKDIR /app

COPY pnpm-lock.yaml .
COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm run build

FROM upshow/pm2:node20

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
ENV TZ="Asia/Shanghai"

RUN npm install pnpm -g

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bootstrap.js ./
COPY --from=builder /app/script ./script
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src/migration ./src/migration

EXPOSE 7001

CMD ["npm", "run", "start"]