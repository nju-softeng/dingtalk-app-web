FROM nginx:latest
COPY nginx.template /etc/nginx/conf.d/nginx.template
COPY dist/ /usr/share/nginx/html/
ENTRYPOINT /bin/bash -c "envsubst < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"