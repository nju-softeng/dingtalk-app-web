FROM nginx

COPY dist/ /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf

RUN echo "Asia/Shanghai" > /etc/timezone