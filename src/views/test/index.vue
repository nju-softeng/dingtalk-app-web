<template>
  <div id="parent">
    <div id="top">top content no need of scroll</div>
    <div id="bottom">
      I need scroll here when this content overflow the parent.
    </div>
    <el-button @click="close()">close</el-button>
  </div>
</template>

<script>
export default {
  created() {
    this.initWebSocket();
  },
  destroyed() {
    // 离开页面时关闭websocket连接
    this.ws.close();
  },
  methods: {
    close() {
      this.ws.close();
    },
    initWebSocket() {
      let that = this;
      if (window.WebSocket) {
        //var server_host = window.location.hostname;//localhost:8080/
        var url = "ws://localhost:8080" + "/websocket";
        let ws = new WebSocket(url);
        that.ws = ws;
        ws.onopen = function() {
          console.log("服务器连接成功: " + url);
        };
        ws.onclose = function() {
          console.log("服务器连接关闭: " + url);
        };
        ws.onerror = function() {
          console.log("服务器连接出错: " + url);
        };
        ws.onmessage = function(e) {
          //接收服务器返回的数据
          console.log(e);
        };
      }
    }
  }
};
</script>

<style scoped></style>
