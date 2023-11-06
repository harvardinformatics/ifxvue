FROM node:16

EXPOSE 8080

WORKDIR /app

RUN npm install -g @vue/cli@4.5.9 @vue/cli-service@4.5.9 sass@1.32.13 eslint@7.9.0 n@7.0.0 node-gyp@7.1.2 prettier@2.3.2

ADD . /app

CMD /bin/bash
