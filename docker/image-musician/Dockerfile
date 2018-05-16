FROM node:carbon

#On crée l'app directory
WORKDIR /usr/src/app

COPY ./src/* ./

RUN npm install

ENTRYPOINT ["node", "musician.js"]
