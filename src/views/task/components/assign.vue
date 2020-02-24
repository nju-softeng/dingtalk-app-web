<template>
  <div>
    <div class="action" style="margin-bottom:10px">
      <el-button type="primary" @click="dialog = true" icon="el-icon-plus">创建迭代任务</el-button>
    </div>
    {{ taskform }}
    <div class="list">
      <el-card class="item" shadow="hover">
        鼠标悬浮时显示
      </el-card>
      <el-card class="item" shadow="hover">
        鼠标悬浮时显示
      </el-card>
      <el-card class="item" shadow="hover">
        鼠标悬浮时显示
      </el-card>
      <el-card class="item" shadow="hover">
        鼠标悬浮时显示
      </el-card>
      <el-card class="item" shadow="hover">
        鼠标悬浮时显示
      </el-card>
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
            <el-input v-model="taskform.name" style="width:350px" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 起止时间:
            </span>
            <el-date-picker v-model="taskform.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              <svg-icon icon-class="paper" /> 分配任务:
            </span>
            <el-tag size="medium" closable style="margin: 0 2px" v-for="u in userlist" :key="u.index" @close="closeTag(u)">{{ u.name }}</el-tag>
            <el-button style="margin-left:2px" size="mini" @click="choose()">
              <i>
                <svg-icon icon-class="addperson" /> </i> 添加</el-button>
          </el-form-item>
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
import { contactChoose } from "@/utils/dingtalk";
export default {
  data() {
    return {
      userlist: [],
      dialog: false,
      list: [],
      taskform: {
        name: "",
        date: [],
        userids: []
      }
    };
  },
  created() {},
  methods: {
    choose() {
      contactChoose(window.location.href, this.taskform.userids).then(res => {
        console.log(res);
        this.userlist = res;
        this.taskform.userids = res.map(x => x.emplId);
      });
    },
    closeTag(u) {
      this.userlist.splice(this.userlist.indexOf(u), 1);
    },
    closeDialog() {
      this.$refs.paperform.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item {
  margin: 5px 5px 5px 0;
  height: 100px;
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
</style>
