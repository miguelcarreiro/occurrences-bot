FROM node:14.15.4

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --chown=node:node . .

RUN npx sequelize-cli db:migrate

RUN chmod -R 777 /home/node/app/data

USER node

CMD [ "npm", "start" ]