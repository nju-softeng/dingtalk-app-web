<template>
  <div class="home">
    <div id="nav">
      <router-link to="/login">Login</router-link>
    </div>
    <router-view />
    <el-row>
      <el-col :span="24">
        <img alt="Vue logo" src="@/assets/logo.png" />
        <h1>Welcome</h1>
      </el-col>
      <el-col :span="24">
        <div class="grid-content" v-loading="loading" element-loading-text="登录中"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAuthCode } from "@/utils/dingtalk";
import { Message } from "element-ui";
export default {
  data: () => ({
    loading: true,
    code: {
      authcode: null
    },
    redirect: undefined,
    otherQuery: {}
  }),
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV == "development") {
      // 配置测试状态无需钉钉登陆;
      this.$store
        .dispatch("user/test_login", 1)
        .then(res => {
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery
          });
          Message.success("测试状态，跳过钉钉登陆");
          console.log(res);
        })
        .catch(() => {
          this.loading = false;
          Message.error("登录失败");
        });
    } else {
      // 获取钉钉临时授权码
      getAuthCode(process.env.VUE_APP_CORPID)
        .then(res => {
          this.code.authcode = res.code; // 获取authcode
          this.$store
            .dispatch("user/_login", this.code)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
            })
            .catch(() => {
              this.loading = false;
              Message.error("dingtalk API 只在钉钉容器中生效,请在工作台打开");
            });
        })
        .catch(e => {
          this.$message({
            showClose: true,
            message: e,
            type: "error",
            duration: "5000"
          });
        });
    }
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #42b983;
}

.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 30px;
}
</style>
