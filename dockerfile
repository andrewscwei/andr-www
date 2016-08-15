FROM node:6.1.0

# Install NPM dependencies
COPY package.json /src/package.json
WORKDIR /src
RUN npm install

# Clone source files
COPY . /src

# Run
CMD ["npm", "run", "dev"]

EXPOSE 3000
