FROM node:12-alpine as uibuild

COPY . /ddi-web
RUN cd /ddi-web && yarn && yarn install && yarn build

FROM alpine:latest
COPY --from=uibuild /ddi-web/dist/ /opt/website/
WORKDIR /opt/website
