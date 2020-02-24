<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="top" style="height: 200px;">
        <el-tab-pane label="任务分配">
          <assign />
        </el-tab-pane>
        <el-tab-pane label="历史任务">配置管理</el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-message">bug管理</i>
            <el-badge :value="1" size="mini" class="badge"></el-badge>
          </span>

          角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {
    assign: () => import("./components/assign")
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
  background-color: #f5f5f5;
  height: 92vh;
  border-radius: 0;
}
.box {
  height: 800px;
  background: #fff;
  padding: 5px 20px 0 20px;
}
</style>
