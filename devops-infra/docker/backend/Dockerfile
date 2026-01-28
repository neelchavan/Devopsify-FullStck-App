FROM node:18-alpine

WORKDIR /app

# Install only prod dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
