FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g ts-node
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 7000