FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server files
COPY . .

# Expose standard server port (will be overridden mapped via docker-compose if different)
EXPOSE 5000
EXPOSE 3000

# Start server in production mode
CMD ["npm", "start"]
