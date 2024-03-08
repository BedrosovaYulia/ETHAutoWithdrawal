FROM node:19

WORKDIR /listener
COPY package.json .
RUN npm install
COPY . .
CMD node listener.js
