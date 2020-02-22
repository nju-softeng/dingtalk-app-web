<template>
  <div id="parent">
    <div id="top">WebSocket Test</div>
    <div id="bottom">
      I need scroll here when this content overflow the parent.
    </div>
    <el-button @click="close()">close</el-button>
    <el-tooltip class="item" effect="dark" placement="top-start">
      <div slot="content">
        <span style="padding:5px;">asdf</span>
        <span style="padding:5px;">asdfa</span>
        <span style="padding:5px;"> asdf</span>
        <span style="padding:5px;">asdfad</span>
      </div>

      <div class="tt">
        <span style="padding:5px;">asdf</span>
        <span style="padding:5px;">asdfa</span>
        <span style="padding:5px;"> asdf</span>
        <span style="padding:5px;">asdfad</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  created() {
    this.initWebSocket();
    console.log(window.location.href);
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

<style scoped>
.tt {
  width: 100px;
  justify-content: flex-start;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
