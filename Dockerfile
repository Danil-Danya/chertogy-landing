FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NITRO_PORT=7000
ENV NITRO_HOST=0.0.0.0
ENV API_BASE_URL=https://admin.pultra.com
ENV SITE_BASE_URL=https://pultra.kls-digital.ru/

EXPOSE 7000

CMD ["npm", "run", "start"]
