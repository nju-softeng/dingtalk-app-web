<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="top" style="height: 200px;">
        <el-tab-pane label="任务分配">
          <assign />
        </el-tab-pane>

        <el-tab-pane label="bug管理">
          <auditbug />
        </el-tab-pane>
        <el-tab-pane label="实验室所有项目">
          <devlist />
        </el-tab-pane>
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
    assign: () => import("./components/assign"),
    auditbug: () => import("./components/auditbug"),
    devlist: () => import("./components/devlist")
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

  border-radius: 0;
}
.box {
  height: 800px;
  background: #fff;
  padding: 5px 20px 0 20px;
}
</style>
