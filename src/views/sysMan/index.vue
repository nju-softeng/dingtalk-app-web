<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="left">
        <el-tab-pane label="用户管理">
          <user-man />
        </el-tab-pane>
        <el-tab-pane label="配置管理">
          <conf-man />
        </el-tab-pane>
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
    userMan: () => import("./components/userMan"),
    confMan: () => import("./components/confMan")
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
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 92vh;
  border-radius: 0;
}

.box {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding-top: 16px;
  padding-left: 10px;
  padding-right: 20px;
  min-height: 89vh;
}
</style>
