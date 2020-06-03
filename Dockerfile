FROM node:10-alpine
COPY ./src ./src
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm run build:unix
ENTRYPOINT ["npm", "run", "start:production"]