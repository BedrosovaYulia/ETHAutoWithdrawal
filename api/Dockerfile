FROM node:19

WORKDIR /api
COPY package.json .
RUN npm install
COPY . .
CMD npm start
