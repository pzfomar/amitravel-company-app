FROM nginx:1.15.6-alpine

COPY publicwww/ /usr/share/nginx/html
