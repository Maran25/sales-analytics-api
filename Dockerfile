FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# to ensure the dist folder exists and contains index.js
RUN ls dist || exit 1

EXPOSE 8080

CMD ["node", "dist/index.js"]
