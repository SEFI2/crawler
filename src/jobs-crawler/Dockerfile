

FROM node:14

WORKDIR /usr/src/app

RUN apt update && apt install -y tesseract-ocr
COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]
