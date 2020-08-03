FROM nginx
COPY  /etc/nginx/conf.d/mysite.template
COPY dist/mysite.template /usr/share/nginx/html/
CMD envsubst '$backend' < /etc/nginx/conf.d/mysite.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
