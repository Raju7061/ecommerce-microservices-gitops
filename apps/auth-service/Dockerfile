FROM node:18-alpine

WORKDIR /app

# package.json copy karein (package-lock na bhi ho toh chalega)
COPY package*.json ./

# npm ci ko badal kar npm install karein
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]