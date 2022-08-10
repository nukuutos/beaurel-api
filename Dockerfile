FROM node:14-slim

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

ARG PORT=5000
ARG NODE_ENV=production
ARG DB_USER=null
ARG DB_PASSWORD=null
ARG DB_CLUSTER=null
ARG DB_NAME=null
ARG REDIS_HOST=null
ARG REDIS_PORT=null
ARG CLIENT_URL=null
ARG AUTH_HEADER=null
ARG JWT_KEY_ACCESS=null
ARG JWT_KEY_REFRESH=null
ARG JWT_KEY_ACCESS_TIME=null
ARG JWT_KEY_REFRESH_TIME=null
ARG IS_SOCKET_IO=null
ARG TWILIO_SID=null
ARG TWILIO_AUTH_TOKEN=null
ARG S3_KEY_ID=null
ARG S3_ACCESS_KEY=null

ENV PORT $PORT
ENV NODE_ENV $NODE_ENV
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_CLUSTER $DB_CLUSTER
ENV DB_NAME $DB_NAME
ENV REDIS_HOST $REDIS_HOST
ENV REDIS_PORT $REDIS_PORT
ENV CLIENT_URL $CLIENT_URL
ENV AUTH_HEADER $AUTH_HEADER
ENV JWT_KEY_ACCESS $JWT_KEY_ACCESS
ENV JWT_KEY_REFRESH $JWT_KEY_REFRESH
ENV JWT_KEY_ACCESS_TIME $JWT_KEY_ACCESS_TIME
ENV JWT_KEY_REFRESH_TIME $JWT_KEY_REFRESH_TIME
ENV IS_SOCKET_IO $IS_SOCKET_IO
ENV TWILIO_SID $TWILIO_SID
ENV TWILIO_AUTH_TOKEN $TWILIO_AUTH_TOKEN
ENV S3_KEY_ID $S3_KEY_ID
ENV S3_ACCESS_KEY $S3_ACCESS_KEY

EXPOSE $PORT

CMD ["npm", "start"]