# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY ["package.json", "package-lock.json", "./"]

# Install dependencies
RUN npm install

# Install Firebase Tools globally
RUN npm install -g firebase-tools

# Install additional project-specific dependencies
RUN npm install @googlemaps/google-maps-services-js --save
RUN npm install @react-oauth/google@latest
RUN npm uninstall react-google-login
RUN npm install @google/generative-ai
RUN npm install react-icons
RUN npm install @react-google-maps/api

# Install ShadCN components
RUN npx shadcn@latest add sonner
RUN npx shadcn@latest add toast
RUN npx shadcn@latest add dialog

# Install testing libraries
RUN npm install --save-dev @testing-library/react @testing-library/jest-dom jest babel-jest jest-environment-jsdom

# Copy the rest of the application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "dev"]
