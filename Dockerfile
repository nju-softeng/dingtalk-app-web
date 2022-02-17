FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /var/www/localhost/

# 自签证书
COPY ssl/localhost.crt /etc/nginx/ssl/localhost.crt
COPY ssl/localhost.key /etc/nginx/ssl/localhost.key
COPY ssl/dhparam.pem /etc/nginx/dhparam.pem

CMD sed -i "s/{corp_id}/$corp_id/g"  /var/www/localhost/env.js; exec nginx -g 'daemon off;'