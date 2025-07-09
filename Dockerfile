FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Убедитесь, что Nest CLI установлен
RUN npm install -g @nestjs/cli