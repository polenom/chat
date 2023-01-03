FROM node
WORKDIR app/
COPY ./package-lock.json ./
COPY ./package.json ./
RUN npm i
COPY ./index.html ./
COPY ./dist ./dist
COPY ./src ./src