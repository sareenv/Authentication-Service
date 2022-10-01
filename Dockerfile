FROM node:14.20.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 5050
ENTRYPOINT [ "node", "index.js" ]
