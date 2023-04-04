FROM node:18-alpine

WORKDIR /usr/app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY ./test-runner-api ./test-runner-api

RUN npm run ci-all
RUN npm run lint-all
RUN npm run build-all


# 2nd stage build to strip out everything that's not needed
FROM node:18-alpine

WORKDIR /usr/app

COPY --from=0 /usr/app/package.json /usr/app/package.json
COPY --from=0 /usr/app/package-lock.json /usr/app/package-lock.json
COPY --from=0 /usr/app/test-runner-api/package.json /usr/app/test-runner-api/package.json
COPY --from=0 /usr/app/test-runner-api/build /usr/app/test-runner-api/build

RUN npm run ci-all-production

EXPOSE 80
CMD ["node", "./test-runner-api/build/index.js"]