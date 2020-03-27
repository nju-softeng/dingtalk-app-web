<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="left">
        <el-tab-pane label="用户管理">
          <user-man />
        </el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tab",
  data() {
    return {
      activeName: "CN",
      createdTimes: 0
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    }
  },
  components: {
    userMan: () => import("./components/userMan")
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1;
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 10px;
  min-height: 92vh;
  border-radius: 0;
}
.box {
  background: #fff;
  padding-top: 20px;
  padding-left: 10px;
  min-height: 89vh;
}
</style>
