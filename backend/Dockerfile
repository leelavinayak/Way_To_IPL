FROM node:18-alpine
WORKDIR /app

# install deps
COPY package*.json ./
RUN npm ci --only=production

# copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
