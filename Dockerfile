FROM node:16

#RUN mkdir -p /var/www/app/node_modules && chown -R node:node /var/www/app

WORKDIR /var/www/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Bundle app source
COPY . .
#COPY --chown=node:node . .

