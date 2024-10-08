FROM node:20-alpine

WORKDIR \app

COPY package* .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node","src/index.js"]

