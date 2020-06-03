FROM node:10-alpine
COPY ./src ./src
COPY package*.json ./
COPY tsconfig.json ./
COPY *.pem ./
RUN npm install
RUN npm run build:unix
EXPOSE 80
ENTRYPOINT ["npm", "run", "start:production"]