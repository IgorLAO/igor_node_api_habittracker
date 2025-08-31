FROM node:lts-alpine AS BUILD

WORKDIR /usr/src/app

COPY . ./

ARG BUILD_ENV
ENV BUILD_ENV=${BUILD_ENV:-docker}

RUN npm i
RUN npm run build
RUN cp package-lock.json /usr/src/app/__RELEASE__
WORKDIR /usr/src/app/__RELEASE__

RUN npm i

FROM node:lts-alpine AS RUNTIME

WORKDIR /usr/src/app

COPY --from=BUILD /usr/src/app/__RELEASE__ /usr/src/app/

EXPOSE 3050

CMD [ "npm", "start" ]