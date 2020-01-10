<template>
  <div class="home">
    <div id="nav">
      <router-link to="/login">Login</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
    <el-row>
      <el-col :span="24">
        <img alt="Vue logo" src="@/assets/logo.png" />
        <h1>Welcome to Softeng Performance Management Application</h1>
        <p>For a guide and recipes on how to configure</p>
      </el-col>
      <el-col :span="24">
        <div class="grid-content" v-loading="loading" element-loading-text="登录中"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as dd from "dingtalk-jsapi";
import { Message } from "element-ui";
export default {
  data: () => ({
    loading: true,
    code: {
      authcode: null
    }
  }),
  created() {
    // 获取钉钉临时授权码
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId: "dingeff939842ad9207f35c2f4657eb6378f",
        onSuccess: result => {
          this.code.authcode = result.code; // 获取authcode
          this.$store
            .dispatch("user/_login", this.code)
            .then(() => {
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
              Message.error("登录失败");
            });
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
.home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

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
