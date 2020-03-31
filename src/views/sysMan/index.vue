<template>
  <div>
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
.box {
  background: #fff;
  padding-top: 16px;
  padding-left: 10px;
  min-height: 89vh;
}
</style>
