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
      activeTab: "myIteration"
    };
  },
  components: {
    myIteration: () => import("../components/myIteration"),
    userbug: () => import("../components/userbug"),
    devlist: () => import("../components/devlist")
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 618px;
}

.dialog-content {
  // background-color: aquamarine;
  display: flex;
  justify-content: center;
}

.app-container {
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 92vh;
  border-radius: 0;
}
.box {
  background: #fff;
  padding: 5px 20px;
  min-height: 89vh;
}
</style>
