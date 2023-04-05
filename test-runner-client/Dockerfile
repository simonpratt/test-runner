FROM node:18-slim 

WORKDIR /usr/app

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY test-runner-api ./test-runner-api
COPY test-runner-client ./test-runner-client

RUN npm run ci-all
RUN npm run lint-all
RUN npm run build-all


# Build the nginx container to serve the files
FROM nginx:stable-slim

COPY --from=0 /usr/app/test-runner-client/build /usr/share/nginx/html
COPY --from=0 /usr/app/test-runner-client/scripts/build-environment.sh /docker-entrypoint.d
COPY --from=0 /usr/app/test-runner-client/config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80