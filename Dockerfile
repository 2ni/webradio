# seems omxplayer not yet available for 64bit
# https://forums.balena.io/t/omxplayer-on-raspberry-pi4-64-bit/42224/11
FROM balenalib/raspberrypi3-node:latest-jessie-build

# pass argument through docker command or docker-compose
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

RUN apt-get update
RUN apt-get -y install omxplayer

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN sed -i "s/'--blank', //" ./node_modules/node-omxplayer/index.js
RUN cat ./node_modules/node-omxplayer/index.js

# Bundle app source
COPY . .

# EXPOSE 3001
CMD [ "npm", "run", "start" ]
#CMD [ "npm", "run", "dev" ]
