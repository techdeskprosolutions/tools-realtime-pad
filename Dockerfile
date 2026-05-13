FROM node:20-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest
COPY . .

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "start"]
