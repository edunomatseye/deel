FROM node:19-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

ENTRYPOINT ["node", "src/server.js"]