<template>
  <div class="home">
    <el-row>
      <el-col :span="24">
        <img alt="Vue logo" src="@/assets/logo.png" />
        <HelloWorld msg="Welcome to Softeng Performance Management Application" />
      </el-col>
      <el-col :span="24">
        <div class="grid-content" v-loading="loading" element-loading-text="登录中"></div>
        <h6>{{ code }}</h6>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import * as dd from "dingtalk-jsapi";
export default {
  data: () => ({
    loading: true,
    code: null
  }),
  components: {
    HelloWorld
  },
  created() {
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId: "dingeff939842ad9207f35c2f4657eb6378f",
        onSuccess: result => {
          this.code = result.code;
          console.log(result.code);
        },
        onFail: err => {
          console.log("err", err);
        }
      });
    });
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 30px;
}
</style>
