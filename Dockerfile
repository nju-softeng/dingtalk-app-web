FROM nginx:latest
COPY mysite.template /etc/nginx/conf.d/mysite.template
COPY dist/ /usr/share/nginx/html/

CMD envsubst '$backend' < /etc/nginx/conf.d/mysite.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
