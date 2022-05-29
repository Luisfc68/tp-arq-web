FROM node:16.12-bullseye

WORKDIR /home/node/app

COPY src ./src
COPY package.json ./

RUN npm install

ENTRYPOINT ["npm", "run", "docker"]