FROM node:argon

RUN mkdir -p /app
WORKDIR /app

COPY bundle.js /app/
COPY index.html /app/

RUN npm install http-server -g

EXPOSE 8888

CMD [ "http-server", "-p 8888" ]
