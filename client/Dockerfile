FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies (ignoring host OS specifics)
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server on all network interfaces to be accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
