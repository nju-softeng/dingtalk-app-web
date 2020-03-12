<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="top" style="height: 200px;">
        <el-tab-pane label="迭代任务"> </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-message">我的bug</i>
            <el-badge :value="1" size="mini" class="badge"></el-badge>
          </span>

          bug管理</el-tab-pane>
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
  components: {},
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
  //height: 92vh;
  border-radius: 0;
}
.box {
  height: 800px;
  background: #fff;
  padding: 5px 20px 0 20px;
}
</style>
