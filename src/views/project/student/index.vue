<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="top" v-model="activeTab">
        <el-tab-pane label="我参与的" name="myIteration"> </el-tab-pane>
        <el-tab-pane label="我的bug" name="userbug"> </el-tab-pane>
        <el-tab-pane label="所有项目" name="devlist"> </el-tab-pane>
      </el-tabs>

      <component :is="activeTab" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      unfinish: true,
      activeTab: "myIteration",
    };
  },
  components: {
    myIteration: () => import("../components/myIteration"),
    userbug: () => import("../components/userbug"),
    devlist: () => import("../components/devlist"),
  },
  created() {
    this.activeTab = this.$route.query.tab || "myIteration";
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.dialog-content {
  display: flex;
  justify-content: center;
}

.app-container {
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 92vh;
}

.box {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding: 5px 20px;
  min-height: 89vh;
}
</style>
