FROM node:latest

RUN npm install webpack -g

ENV PORT 3000

WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/

RUN webpack

ENV NODE_ENV=development

CMD [ "/usr/local/bin/node", "./index.js" ]