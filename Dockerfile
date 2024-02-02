FROM node:16.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1341

CMD [ "npm", "start" ]
