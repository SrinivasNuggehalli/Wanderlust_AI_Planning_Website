# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy files
COPY ["package.json", "package-lock.json", "./"]
COPY .env ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the Vite development port
EXPOSE 5173

# Command to start the Vite application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
