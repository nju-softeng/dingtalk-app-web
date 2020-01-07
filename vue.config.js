module.exports = {
  devServer: {
    // 默认端口
    disableHostCheck: true, // 解决 Invalid Host header
    port: 8081,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
        changeOrigin: true
      }
    }
  },
  productionSourceMap: false
  // 生成环境配置
  // 默认按部署在服务器根路径配置
  // 编译时资源按相对路径声明，可部署在任意路径
  // publicPath: "./",
  // productionSourceMap: false
};
