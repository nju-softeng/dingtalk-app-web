"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    disableHostCheck: true, // 解决 Invalid Host header
    // 默认端口
    port: 8081,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false,
  // 生成环境配置
  // 默认按部署在服务器根路径配置
  // 编译时资源按相对路径声明，可部署在任意路径
  // publicPath: "./",
  // productionSourceMap: false
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  }
};
