FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ]