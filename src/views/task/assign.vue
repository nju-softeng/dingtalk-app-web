<template>
  <div class="app-container">
    <div class="box">
      <div class="action" style="margin-bottom:10px">
        <el-button type="primary" @click="dialog = true" icon="el-icon-plus">创建迭代任务</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialog">
      <div slot="title">
        <span class="title-age">创建迭代任务 </span>
      </div>
      <div>
        <el-form>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 迭代名称:
            </span>
            <el-input style="width:350px" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 起止时间:
            </span>
            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item> </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList } from "@/api/common";

export default {
  data() {
    return {
      flag: false,
      userlist: [],
      dialog: false,
      list: []
    };
  },
  created() {
    console.log(this.$route.params.path);
    getUserList().then(res => {
      this.userlist = res.data;
    });
  },
  methods: {
    closeDialog() {
      this.$refs.paperform.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.test {
  border-radius: 8px;
  width: 90%;
}
.el-form {
  width: 618px;
}
.paper-form {
  display: flex;
  // background-color: yellow;
}

.dialog-content {
  // background-color: aquamarine;
  display: flex;
  justify-content: center;
}

.paper-form >>> .el-input__inner {
  width: 220px;

  border-end-end-radius: 0;
  /*outline: medium;*/
}
.app-container {
  background-color: #f5f5f5;
  min-height: 750px;
  border-radius: 0;
}
.box {
  min-height: 60px;
  background: #fff;
  padding: 20px 20px 0 20px;
}
.item {
  background: #fff;
  padding: 12px 12px 12px 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #f6f6f6;
  .left-content {
    display: flex;
    flex-direction: column;
    .title {
      color: #1897ff;
      font-weight: 500;
      margin-bottom: 5px;
      width: 400px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .detail {
      color: gray;
      font-size: 13px;
      padding-top: 5px;
      .journal {
        width: 250px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding-left: 5px;
      }
    }
  }
  .namelist {
    width: 200px;
    padding: 0 20px;
  }
  .info-item {
    color: gray;
    display: flex;
    flex-direction: column;
    padding-left: 48px;
    font-size: 13px;
    align-items: center;
  }
}
.content {
  height: 50px;
  display: flex;
  justify-content: flex-start;
}
</style>
