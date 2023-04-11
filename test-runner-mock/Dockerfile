FROM node:18-slim

WORKDIR /usr/app

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY ./test-runner-mock ./test-runner-mock

RUN npm run ci-all
RUN npm run build-all

# 2nd stage build to strip out everything that's not needed
FROM node:18-slim

WORKDIR /usr/app

COPY --from=0 /usr/app/package.json /usr/app/package.json
COPY --from=0 /usr/app/package-lock.json /usr/app/package-lock.json
COPY --from=0 /usr/app/test-runner-mock/package.json /usr/app/test-runner-mock/package.json
COPY --from=0 /usr/app/test-runner-mock/build /usr/app/test-runner-mock/build

RUN npm run ci-all-production

# EXPOSE 80
CMD ["node", "./test-runner-mock/build/start.js"]