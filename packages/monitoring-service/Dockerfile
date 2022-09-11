FROM node:16 AS build
WORKDIR /usr/src/app
COPY ./ ./
RUN yarn install
RUN yarn build

FROM node:16-alpine
ENV NODE_ENV production
ENV BACKUP_FOLDER /tmp
RUN apk add --no-cache postgresql-client
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY init.sh init.sh
EXPOSE 3000
ENTRYPOINT ["sh", "init.sh"]
