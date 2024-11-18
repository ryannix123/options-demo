FROM registry.access.redhat.com/ubi9/nodejs-18:latest

WORKDIR /opt/app-root/src

# Create views directory
RUN mkdir views

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy views and other files
COPY views/ ./views/
COPY index.js .

EXPOSE 3000

CMD ["node", "index.js"]