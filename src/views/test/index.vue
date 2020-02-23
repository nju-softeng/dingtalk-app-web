<template>
  <div id="parent">
    <div id="top">WebSocket Test</div>
    <div id="bottom">
      I need scroll here when this content overflow the parent.
    </div>

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
//import { authenticate } from "@/api/common";

import { contactChoose, getAuthCode } from "@/utils/dingtalk";
export default {
  created() {
    getAuthCode("dingeff939842ad9207f35c2f4657eb6378f").then(res => {
      console.log(res);
    });
    contactChoose(window.location.href).then(res => {
      console.log(res);
    });
  },
  methods: {}
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
