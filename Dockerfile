FROM gplane/pnpm:8.4.0 as builder

WORKDIR /app

COPY pnpm-lock.yaml .
COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm run build

FROM keymetrics/pm2:16-jessie

WORKDIR /app

COPY --from=builder /app/package.json ./
ENV TZ="Asia/Shanghai"

RUN npm install pnpm -g

RUN pnpm install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bootstrap.js ./
COPY --from=builder /app/script ./script
COPY --from=builder /app/src/config ./config
COPY --from=builder /app/tsconfig.json ./

EXPOSE 7001

CMD ["npm", "run", "start"]