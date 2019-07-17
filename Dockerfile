FROM node:alpine

WORKDIR /usr/src/app
ADD package.json package-lock.json /usr/src/app/

RUN npm install
ADD index.js /usr/src/app/