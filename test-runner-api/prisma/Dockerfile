FROM node:18-slim

WORKDIR /usr/app

COPY ./test-runner-api/prisma/scripts ./scripts
COPY ./test-runner-api/prisma/migrations ./migrations
COPY ./test-runner-api/prisma/schema.prisma schema.prisma

RUN apk add --no-cache postgresql-client
RUN npm i prisma
RUN chmod +x scripts/create-and-migrate.sh

CMD ["./scripts/create-and-migrate.sh"]
