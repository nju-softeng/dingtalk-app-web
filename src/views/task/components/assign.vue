<template>
  <div>
    <div class="action" style="margin-bottom:10px">
      <el-button type="primary" @click="dialog = true" icon="el-icon-plus">创建迭代任务</el-button>
    </div>
    {{ projectform }}
    <div class="list">
      <el-card class="item" v-for="(item, index) in list" :key="index" shadow="hover">
        {{ item.name }}

        <p style="font-size:12px">
          迭代周期: {{ item.beginTime }} ~ {{ item.endTime }}
        </p>

        <el-tag style="margin-right:5px" size="small" v-for="(pd, index) in item.projectDetails" :key="index">{{ pd.user.name }}</el-tag>
      </el-card>
    </div>
    {{ uid }}
    <el-dialog :visible.sync="dialog" width="55%">
      <div slot="title">
        <span class="title-age">创建迭代任务 </span>
      </div>

      <el-form v-loading="loading" ref="projectform" :rules="rules" :model="projectform">
        <el-form-item prop="name">
          <span slot="label">
            <svg-icon icon-class="paper" /> 迭代名称: </span>
          <el-input v-model="projectform.name" style="width:350px" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="dates">
          <span slot="label">
            <svg-icon icon-class="paper" /> 起止时间: </span>
          <el-date-picker v-model="projectform.dates" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="dingIds">
          <span slot="label">
            <svg-icon icon-class="paper" /> 分配任务: </span>
          <el-tag size="medium" closable style="margin: 0 2px" v-for="(u, index) in userlist" :key="index" @close="closeTag(u)">{{ u.name }}</el-tag>
          <el-button style="margin-left:2px" size="mini" @click="choose()">
            <i>
              <svg-icon icon-class="addperson" /> </i> 添加</el-button>
        </el-form-item>
      </el-form>
      {{ uid }}
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addProject, listUnfinishProject } from "@/api/project.js";
import { contactChoose } from "@/utils/dingtalk";

export default {
  data() {
    return {
      userlist: [],
      dialog: false,
      list: [],
      uid: "",
      loading: false,
      projectform: {
        name: "",
        auditorid: "",
        dates: [],
        dingIds: []
      },
      rules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        dates: [{ required: true, message: "请选择时间", trigger: "blur" }],
        dingIds: [{ required: true, message: "请分配任务", trigger: "blur" }]
      }
    };
  },
  created() {
    this.uid = sessionStorage.getItem("uid");
    listUnfinishProject(this.uid).then(res => {
      this.list = res.data;
      console.log(res.data);
    });
  },
  computed: {},
  methods: {
    submit() {
      this.projectform.auditorid = this.uid;
      this.$refs.projectform.validate(valid => {
        if (valid) {
          this.loading = true;
          addProject(this.projectform)
            .then(() => {
              this.dialog = false;
              this.$notify({
                title: "成功",
                message: "创建迭代成功",
                type: "success"
              });
              listUnfinishProject(this.uid).then(res => {
                this.list = res.data;
              });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填写必要信息",
            type: "warning"
          });
        }
      });
    },
    choose() {
      contactChoose(window.location.href, this.projectform.dingIds).then(
        res => {
          console.log(res);
          this.userlist = res;
          this.projectform.dingIds = res.map(x => x.emplId);
        }
      );
    },
    closeTag(u) {
      this.userlist.splice(this.userlist.indexOf(u), 1);
      this.projectform.dingIds.splice(this.projectform.dingIds.indexOf(u), 1);
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
</style>
