FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    libc6-compat \
    openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN rm -rf dist

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
