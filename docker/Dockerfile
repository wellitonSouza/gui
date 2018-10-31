FROM node:9 AS basis

RUN mkdir /data
WORKDIR /data

COPY . .
RUN yarn install && yarn run build


FROM nginx

COPY --from=basis /data/dist /usr/share/nginx/html

EXPOSE 80
