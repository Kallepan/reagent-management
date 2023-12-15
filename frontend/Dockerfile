FROM node:18-alpine as builder

WORKDIR /app

COPY ./package.json ./yarn.lock ./angular.json ./
RUN yarn install

COPY . .
RUN yarn run build --configuration=production

FROM nginx:alpine

COPY --from=builder /app/dist/frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
