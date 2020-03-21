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
    //配置测试状态无需钉钉登陆;
    // this.$store
    //   .dispatch("user/test_login", 5)
    //   .then(res => {
    //     this.$router.push({
    //       path: this.redirect || "/",
    //       query: this.otherQuery
    //     });
    //     Message.success("测试状态，跳过钉钉登陆");
    //     console.log(res);
    //   })
    //   .catch(() => {
    //     this.loading = false;
    //     Message.error("登录失败");
    //   });

    // 获取钉钉临时授权码
    getAuthCode("dingeff939842ad9207f35c2f4657eb6378f").then(res => {
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
          Message.error("登录失败");
        });
    });
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
