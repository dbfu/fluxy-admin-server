FROM gplane/pnpm:8.4.0 as build

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

FROM keymetrics/pm2:16-jessie

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./

ENV TZ="Asia/Shanghai"

RUN npm install --omit=dev --registry=https://registry.npm.taobao.org

# 如果端口更换，这边可以更新一下
EXPOSE 7001

CMD ["npm", "run", "start"]