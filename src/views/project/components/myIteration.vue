<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.project /deep/ .el-dialog__body {
  padding-top: 5px;
}

.project /deep/ .el-card__body {
  padding: 15px;
}

p {
  font-size: 12.5px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 750px;
}

.item {
  margin: 5px 5px 5px 0;
  height: 120px;
  width: 49%;
}

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
  min-height: 60px;
  background: #fff;
  padding: 10px 20px 0 20px;
}

.projectdc {
  display: flex;
  padding-top: 5px;
  padding-bottom: 10px;
  .dcitem {
    width: 150px;
    margin-right: 5px;
  }
  /deep/ .el-card__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
.acinput {
  /deep/ .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
