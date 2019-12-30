FROM node:8.9.3-alpine as build-deps
RUN mkdir /ghf-web-app
WORKDIR /ghf-web-app
COPY . /ghf-web-app
RUN npm install --silent > "/dev/null" 2>&1
RUN npm run build > "/dev/null" 2>&1

FROM nginx:1.12-alpine
RUN apk update \
    && apk add openssl \
    && apk add --no-cache jq

COPY --from=build-deps /ghf-web-app/build /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

COPY certs/ /etc/nginx/

ADD docker-entrypoint.sh docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

ADD run.sh run.sh
RUN chmod +x run.sh
CMD ["./run.sh"]