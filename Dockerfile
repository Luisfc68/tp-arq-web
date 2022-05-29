FROM node:16.12-bullseye

WORKDIR /home/node/app

COPY src package.json ./

RUN npm install

CMD ["npm", "start"]