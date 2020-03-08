<template>
  <div>
    <div class="action" style="margin-bottom:10px">
      <el-button type="primary" @click="dialog = true" icon="el-icon-plus">创建迭代任务</el-button>
      <el-select v-model="unfinish" @change="changeStatus" style="width:100px;float:right;margin-right:10px">
        <el-option label="进行中" :value="true"> </el-option>
        <el-option label="已结束" :value="false"> </el-option>
      </el-select>
    </div>

    <div class="list" v-loading="loading">
      <div v-if="list.length == 0" style="margin-left: auto;margin-right: auto;padding-top:100px">
        <svg-icon icon-class="null" style="font-size:40px" />
        <div style="height:20px">无数据</div>
      </div>
      <el-card class="item" v-for="(item, index) in list" :key="index" shadow="hover">
        <div>
          <div v-if="unfinish" style="float:right">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button type="text"><i class="el-icon-more "></i></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="modify(item)" icon="el-icon-edit">修改任务</el-dropdown-item>
                <el-dropdown-item @click.native="deleteProject(item.id)" icon="el-icon-error">删除任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-link :underline="false" @click="detail(item)" type="primary">{{
              item.name
            }}</el-link>
          </div>
        </div>
        <p style="font-size:12.5px">
          <span>迭代周期: {{ item.beginTime }} ~ {{ item.endTime }}</span>
          <span style="padding:15px; color:#67C23A" v-if="getRemainDay(item.endTime) >= 0">
            剩余: {{ getRemainDay(item.endTime) }} 天</span>
          <span style="padding:15px; color:#F56C6C" v-else>
            延期: {{ -getRemainDay(item.endTime) }} 天</span>
        </p>

        <el-tag style="margin-right:5px" size="small" v-for="(pd, index) in item.projectDetails" :key="index">{{ pd.user.name }}</el-tag>
        <el-button style="float:right" @click="detail" size="mini">修改状态</el-button>
      </el-card>
    </div>

    <el-dialog :visible.sync="dialog" @close="clearProjectForm" width="55%">
      <div slot="title">
        <span class="title-age">迭代任务 </span>
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
          <el-date-picker value-format="yyyy-MM-dd" v-model="projectform.dates" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="detailDialog" top="5vh" width="80%">
      <div slot="title">
        <span class="title-age">迭代任务 </span>
      </div>
      <span>这是一段信息</span>
      <div style="height:60vh"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addProject,
  listUnfinishProject,
  listfinishProject,
  deleteProject
} from "@/api/project.js";
import { contactChoose } from "@/utils/dingtalk";

export default {
  data() {
    return {
      userlist: [],
      unfinish: true,
      dialog: false,
      list: [],
      loading: false,
      uid: "",
      detailDialog: false,
      projectform: {
        id: "",
        name: "",
        auditorid: "",
        dates: [],
        dingIds: [],
        updateDingIds: false
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
    });
  },
  computed: {
    getRemainDay() {
      return endtime => {
        let day =
          (new Date(endtime) - new Date().setHours(8, 0, 0, 0)) /
          (24 * 3600 * 1000);
        return day;
      };
    }
  },
  methods: {
    detail(item) {
      this.detailDialog = true;
      console.log(item);
    },
    changeStatus(val) {
      this.loading = true;
      if (val) {
        listUnfinishProject(this.uid).then(res => {
          this.list = res.data;
          this.loading = false;
        });
      } else {
        listfinishProject(this.uid).then(res => {
          this.list = res.data;
          this.loading = false;
        });
      }
    },
    modify(item) {
      console.log(item);
      this.dialog = true;
      this.$nextTick(() => {
        console.log(item);
        this.projectform.name = item.name;
        this.projectform.id = item.id;
        this.projectform.dates.push(item.beginTime);
        this.projectform.dates.push(item.endTime);
        this.userlist = item.projectDetails.map(x => {
          return x.user;
        });
        this.projectform.dingIds = item.projectDetails.map(x => {
          return x.user.userid;
        });
      });
    },
    clearProjectForm() {
      console.log("close");
      this.$refs.projectform.resetFields();
      this.userlist = [];
    },
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
    deleteProject(id) {
      this.$confirm("此操作将删除开发任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          deleteProject(id).then(() => {
            listUnfinishProject(this.uid).then(res => {
              this.list = res.data;
            });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    choose() {
      this.projectform.updateDingIds = true;
      contactChoose(window.location.href, this.projectform.dingIds).then(
        res => {
          console.log(res);
          this.userlist = res;
          this.projectform.dingIds = res.map(x => x.userid);
        }
      );
    },
    closeTag(u) {
      this.projectform.updateDingIds = true;
      this.userlist.splice(this.userlist.indexOf(u), 1);
      this.projectform.dingIds.splice(
        this.projectform.dingIds.indexOf(u.userid),
        1
      );
    },
    closeDialog() {
      this.$refs.paperform.resetFields();
      this.projectform.updateDingIds = false;
      this.projectform.id = null;
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>
