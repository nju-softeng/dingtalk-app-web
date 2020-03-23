<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="top">
        <el-tab-pane label="我参与的">
          <my-iteration />
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-message">我的bug</i>
            <el-badge :value="1" size="mini" class="badge"></el-badge>
          </span>
          <userbug />
        </el-tab-pane>
        <el-tab-pane label="所有项目">
          <devlist />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      unfinish: true
    };
  },
  components: {
    myIteration: () => import("./components/myIteration"),
    userbug: () => import("./components/userbug"),
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
  min-height: 92vh;
  border-radius: 0;
}
.box {
  background: #fff;
  padding: 5px 20px;
  min-height: 89vh;
}
</style>
