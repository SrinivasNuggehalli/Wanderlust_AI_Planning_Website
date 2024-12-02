# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ["package.json", "package-lock.json", "./"]

# Copy the rest of the application source code
COPY . .

# Expose the application port
EXPOSE 5173

# Command to start the application
CMD ["npm", "run", "dev"]
