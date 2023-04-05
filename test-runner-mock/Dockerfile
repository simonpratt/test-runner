FROM node:18-slim

WORKDIR /usr/app

COPY ./build ./build
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm ci --only=production
