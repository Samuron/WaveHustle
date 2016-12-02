FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install webpack -g
RUN npm install

# Bundle app source
COPY . /usr/src/app
COPY ./index.html /usr/src/app/dist
RUN webpack

EXPOSE 3000
CMD [ "npm", "run", "express" ]