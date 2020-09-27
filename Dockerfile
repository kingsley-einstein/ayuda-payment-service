FROM node:10-alpine
COPY ./src ./src
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
ENTRYPOINT ["npm", "run", "start:production"]