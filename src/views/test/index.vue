<template>
  <div id="parent">
    <div id="top">WebSocket Test</div>
    <div id="bottom">
      I need scroll here when this content overflow the parent.
    </div>
    <img width="100" :src="imgUrl" />

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
import Identicon from "identicon.js";

export default {
  data() {
    return {
      imgUrl: ""
    };
  },
  created() {
    let imgData = new Identicon(
      "d3b07384d113edec49eaa6238ad5ff00",
      100
    ).toString();
    console.log(imgData);
    this.imgUrl = "data:image/png;base64," + imgData;
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
