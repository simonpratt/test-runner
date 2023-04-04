FROM node:18-alpine

WORKDIR /usr/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY ./universal-test-runner-api ./universal-test-runner-api
COPY ./universal-test-runner-orchestrator ./universal-test-runner-orchestrator

RUN npm run ci-all
RUN npm run lint-all
RUN npm run build-all

# 2nd stage build to strip out everything that's not needed
FROM node:18-alpine

WORKDIR /usr/app

COPY --from=0 /usr/app/package.json /usr/app/package.json
COPY --from=0 /usr/app/package-lock.json /usr/app/package-lock.json
COPY --from=0 /usr/app/universal-test-runner-orchestrator/package.json /usr/app/universal-test-runner-orchestrator/package.json
COPY --from=0 /usr/app/universal-test-runner-orchestrator/build /usr/app/universal-test-runner-orchestrator/build

RUN npm run ci-all-production

# EXPOSE 80
CMD ["node", "./universal-test-runner-orchestrator/build/index.js"]