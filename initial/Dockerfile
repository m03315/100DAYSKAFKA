FROM alpine:latest

RUN apk update && apk add curl \
    && curl -sL --http1.1 https://cnfl.io/cli | sh -s -- latest

