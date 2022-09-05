FROM node:16 AS build
WORKDIR /usr/src/app
COPY ./ ./
RUN yarn install
RUN yarn build

FROM node:16-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist/src ./
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
ENTRYPOINT ["node", "main.js"]
