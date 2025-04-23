FROM registry.access.redhat.com/ubi9/nodejs-22:latest

WORKDIR /opt/app-root/src

COPY --chown=1001:0 package*.json ./
RUN npm install

COPY --chown=1001:0 index.js .
COPY --chown=1001:0 views/ ./views/
COPY --chown=1001:0 imgs/ ./imgs/

EXPOSE 8080

CMD ["node", "index.js"]