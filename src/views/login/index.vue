<template>
  <div class="home">
    <el-row>
      <el-col :span="24">
        <img alt="Vue logo" src="@/assets/logo.png" />
        <h1>Welcome to Softeng Performance Management Application</h1>
        <p>For a guide and recipes on how to configure / customize this project</p>
      </el-col>
      <el-col :span="24">
        <div class="grid-content" v-loading="loading" element-loading-text="登录中"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login } from "@/api/login";
import * as dd from "dingtalk-jsapi";
export default {
  data: () => ({
    loading: true,
    code: {
      authcode: null
    }
  }),
  created() {
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId: "dingeff939842ad9207f35c2f4657eb6378f",
        onSuccess: result => {
          this.code.authcode = result.code;
          login(this.code);
        },
        onFail: err => {
          console.log("err", err);
        }
      });
    });
    //todo
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
