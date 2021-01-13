FROM node:14.15.4

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN npx sequelize-cli db:migrate

COPY . .

COPY --chown=node:node . .

USER node

CMD [ "npm", "start" ]