FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy the TypeScript configuration file
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript files
RUN npm run build

# Specify the command to run the application
CMD ["node", "dist/index.js"]