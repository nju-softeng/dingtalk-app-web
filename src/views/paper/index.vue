<template>
  <div class="app-container">
    <div class="paper-box">
      <div class="action" style="margin-bottom:10px; display: flex; justify-content: space-between; align-content: center">

        <tabs v-model="test">
          <tab-pane label="组内评审" name="name1"></tab-pane>
          <tab-pane label="组外评审" name="name2"></tab-pane>
        </tabs>

        <div style=" display:flex; justify-content: center; align-items: center; ">
          <el-input placeholder="请输入内容" style="margin-right: 5px">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" @click="dialog = true" icon="el-icon-plus">添加论文</el-button>
        </div>
      </div>

      <component  v-bind:is="activetab"></component>

    </div>
  </div>
</template>
<script>
import { getUserList } from "@/api/common";
import TabNav from "@/components/TabNav";
import Tabs from "@/components/TabNav/tabs"
import TabPane from "@/components/TabNav/tabpane"
import paperInternal from "@/views/paper/paperInternal";
import paperExternal from "@/views/paper/paperExternal";


import {
  addPaper,
  listPaper,
  createVote,
  submitResult,
  rmPaper
} from "@/api/paper";

export default {
  data() {
    return {
      activetab:""
    };
  },
  components:{
    TabNav,
    Tabs,
    TabPane,
    paperInternal
  },
  created() {

  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.tableClass {
  /deep/ .el-table__fixed-right {
    height: calc(100% - 11px) !important; //设置高优先，以覆盖内联样式
  }
  /deep/ .el-table__fixed-right::before {
    height: 0px !important; //设置高优先，以覆盖内联样式
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form {
  width: 618px;
}
.paper-form {
  display: flex;
}

.dialog-content {
  display: flex;
  justify-content: center;
}

.app-container {
  background-color: #f5f5f5;
  min-height: 95vh;
}

.paper-box {
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}

.list {
  min-height: 60px;
  background: #fff;
  padding: 20px 20px 0 20px;
}

.paper-item {
  padding: 3px 12px 3px 0;
  border-width: 0 0 1px 0;

  .left-content {
    font-size: 13px;
    display: flex;
    flex-direction: column;
    .title {
      a {
        color: #0366d6;
      }
      color: #409eff;
      font-weight: 500;
      margin-bottom: 5px;
      width: 330px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .detail {
      display: flex;
      color: gray;
      font-size: 13px;
      padding-top: 7px;
      .journal {
        width: 180px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding-left: 5px;
      }
    }
  }

  .info-item {
    color: gray;
    display: flex;
    justify-content: flex-start;
    font-size: 13px;
    align-items: center;
  }
}

.namelist {
  min-width: 100px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap;
  text-overflow: ellipsis;
}

.content {
  height: 50px;
  display: flex;
  justify-content: flex-start;
}

.paper-tag {
  width: 72px;
  text-align: center;
}
</style>
