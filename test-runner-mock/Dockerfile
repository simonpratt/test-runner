FROM node:18-slim

WORKDIR /usr/app

COPY ./build ./build
COPY ./package.json ./package.json

# Bit of a dodgy build since this is part of the workspace but it's not worth doing a proper workspace-scoped build with npm ci
RUN npm i --only=production
