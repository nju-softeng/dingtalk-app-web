#FROM nginx:latest
#COPY mysite.template /etc/nginx/conf.d/mysite.template
#COPY dist/ /usr/share/nginx/html/
#
## 将文件中的corp_id替换成真实的corp_id
#CMD sed -i "s/{corp_id}/$corp_id/g"  /usr/share/nginx/html/env.js;
## 替换环境变量
# envsubst '$backend' < /etc/nginx/conf.d/mysite.template > /etc/nginx/conf.d/default.conf &&
## 启动nginx容器
# exec nginx -g 'daemon off;'


FROM node:16.14.0 as builder
#LABEL maintainer="191250075@smail.nju.edu.cn"
COPY . /app/
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist --userconfig=$HOME/.cnpmrc
RUN npm run build

FROM nginx:latest
LABEL maintainer="191250075@smail.nju.edu.cn"
COPY mysite.template /etc/nginx/conf.d/mysite.template
COPY --from=builder /app/dist /usr/share/nginx/html

ENV corp_id="dinge9c9df3e73479fe235c2f4657eb6378f"
ENV backend="server:8080"

# 将文件中的corp_id替换成真实的corp_id; 替换环境变量; 启动nginx容器
CMD sed -i "s/{corp_id}/$corp_id/g"  /usr/share/nginx/html/env.js; envsubst '$backend' < /etc/nginx/conf.d/mysite.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
