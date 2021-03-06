FROM node:8.1.2

ENV NODE_ENV production

RUN apt-get update && \
    apt-get install -y bash git build-essential \
    automake autoconf make g++ libtool libcairo2-dev
RUN npm install -g node-gyp@3.6.2 --loglevel warn

# Create app directory
RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY npm-shrinkwrap.json /usr/src/app/
RUN npm install --loglevel warn

# Bundle app source
COPY . /usr/src/app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
