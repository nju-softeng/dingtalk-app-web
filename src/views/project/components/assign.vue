<template>
  <div class="project">
    <!-- 添加button  -->
    <div class="action" style="margin-bottom:10px">
      <el-button type="primary" @click="projectDialog = true" icon="el-icon-plus">创建项目</el-button>
    </div>

    <!-- 项目列表 -->
    <div class="list" v-loading="loading">
      <!-- 无数据提示  -->
      <div v-if="list.length == 0" style="margin-left: auto;margin-right: auto; padding-top:100px">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
      <!-- 项目卡片 -->
      <el-card class="item" v-for="(item, index) in list" :key="index" shadow="hover">
        <div>
          <!-- 下拉菜单 -->
          <div style="float:right">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more "></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="modifyProject(item)" icon="el-icon-edit">修改项目</el-dropdown-item>
                <el-dropdown-item @click.native="rmProject(item)" icon="el-icon-error">删除项目</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 标题 -->
          <div>
            <router-link :to="'/project/detail/' + item.id" class="link-type">
              <el-link :underline="false" type="primary">{{
                item.title
              }}</el-link>
            </router-link>
          </div>
        </div>
        <template v-if="item.cnt == 0">
          <p style="font-size:12.5px">请新建迭代</p>
          <el-button style="float:right" v-if="item.cnt == 0 || item.status" @click="newIterate(item.id)" size="mini">新建迭代</el-button>
        </template>
        <template v-else>
          <p style="font-size:12.5px">
            <span>第 {{ item.cnt }} 次迭代</span>
            <span style="padding-left:10px">
              {{ item.begin_time }} ~ {{ item.end_time }}</span>
          </p>
          <div style="font-size:12.5px; ">
            <span style="color:#67C23A" v-if="getRemainDay(item.end_time) >= 0">
              剩余: {{ getRemainDay(item.end_time) }} 天</span>
            <span style="color:#F56C6C" v-else>
              延期: {{ -getRemainDay(item.end_time) }} 天</span>
            <span style="padding:10px; font-size:12.5px; color:#409EFF">预期AC：{{ item.expectedac }}</span>
            <el-button style="float:right" @click="detail(item)" size="mini">确认完成</el-button>
          </div>
        </template>
      </el-card>
    </div>

    <!-- 创建项目dialog -->
    <el-dialog title="项目" @submit.native.prevent :visible.sync="projectDialog" width="32%" @close="clearProjectForm">
      <el-form style="width:100%" v-loading="loading" ref="projectform" :rules="rules" :model="projectform">
        <el-form-item prop="title">
          <el-input v-model="projectform.title" style="width:100% !important" placeholder="项目名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProject" style="width:100%">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加迭代dialog -->
    <el-dialog title="迭代任务" :visible.sync="iterateDiaog" width="60%">
      <el-form v-loading="loading" style="width:100%" ref="iterateform" :rules="rules" :model="iterateform">
        <el-form-item prop="dates">
          <span slot="label">
            <svg-icon icon-class="paper" /> 起止时间: </span>
          <el-date-picker value-format="yyyy-MM-dd" v-model="iterateform.dates" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
        <el-button type="primary" @click="submitIterate()">确 定</el-button>
      </div>
    </el-dialog>
    {{ iterateform }}
  </div>
</template>
<script>
import {
  createProject,
  listProject,
  createIteration,
  rmProject
  // addProject,
  // listUnfinishProject,
  // listfinishProject,
  // deleteProject,
  // getProjectDc,
  // computeProjectAc,
  // autoSetAc,
  // manualSetAc
} from "@/api/project.js";
import { contactChoose } from "@/utils/dingtalk";

export default {
  data() {
    return {
      projectDialog: false,
      iterateDiaog: false,
      pid: "",
      userlist: [],
      list: [],
      loading: false,
      projectAc: {},
      projectform: {
        id: "",
        title: ""
      },
      iterateform: {
        id: "",
        cnt: "",
        dates: [],
        dingIds: [],
        updateDingIds: false
      },
      tmp: {
        name: "",
        dates: ["", ""]
      },
      dclist: [],
      rules: {
        title: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        dates: [{ required: true, message: "请选择时间", trigger: "blur" }],
        dingIds: [{ required: true, message: "请分配任务", trigger: "blur" }]
      }
    };
  },
  created() {
    listProject().then(res => {
      this.list = res.data;
      console.log(this.list);
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
    // 创建或更新项目
    submitProject() {
      this.$refs.projectform.validate(valid => {
        if (valid) {
          this.loading = true;
          createProject(this.projectform)
            .then(() => {
              this.projectDialog = false;
              this.$notify({
                title: "成功",
                message: "提交成功",
                type: "success"
              });
              listProject().then(res => {
                this.list = res.data;
              });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填写项目名称",
            type: "warning"
          });
        }
      });
    },
    // 修改项目
    modifyProject(item) {
      this.projectDialog = true;
      this.$nextTick(() => {
        this.projectform.id = item.id;
        this.projectform.title = item.title;
      });
    },
    // 删除项目
    rmProject(item) {
      console.log("/????");
      if (item.cnt != 0) {
        this.$message({
          showClose: true,
          message: "请删除项目的迭代之后，再删除项目",
          type: "warning"
        });
      } else {
        rmProject(item.id).then(() => {
          listProject().then(res => {
            this.list = res.data;
          });
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        });
      }
    },
    // 清空dialog
    clearProjectForm() {
      this.$refs.projectform.resetFields();
      this.projectform.id = "";
    },
    //新建一个迭代
    newIterate(id) {
      this.iterateDiaog = true;
      this.pid = id;
    },
    // 创建或更新项目
    submitIterate() {
      this.$refs.iterateform.validate(valid => {
        if (valid) {
          this.loading = true;
          createIteration(this.pid, this.iterateform)
            .then(() => {
              this.iterateDiaog = false;
              this.$notify({
                title: "成功",
                message: "创建迭代成功",
                type: "success"
              });
              listProject().then(res => {
                this.list = res.data;
              });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "提交失败",
            message: "请填写项目名称",
            type: "warning"
          });
        }
      });
    },

    //钉钉选人
    choose() {
      this.projectform.updateDingIds = true;
      contactChoose(window.location.href, this.projectform.dingIds).then(
        res => {
          console.log(res);
          this.userlist = res;
          this.iterateform.dingIds = res.map(x => x.userid);
        }
      );
    }
    // manualAc(pid, data) {
    //   manualSetAc(pid, data).then(() => {
    //     this.$notify({
    //       title: "成功",
    //       message: "修改项目状态成功",
    //       type: "success"
    //     });
    //     listUnfinishProject(this.uid).then(res => {
    //       this.list = res.data;
    //     });
    //   });
    // },
    // SetAc(pid) {
    //   autoSetAc(pid, this.finishtime).then(() => {
    //     this.$notify({
    //       title: "成功",
    //       message: "修改项目状态成功",
    //       type: "success"
    //     });
    //     listUnfinishProject(this.uid).then(res => {
    //       this.list = res.data;
    //     });
    //   });
    // },
    // changeftime() {
    //   if (this.finishtime) {
    //     getProjectDc(this.tmp.id, this.finishtime).then(res => {
    //       console.log(res.data);
    //       this.dclist = res.data;
    //     });
    //     computeProjectAc(this.tmp.id, this.finishtime).then(res => {
    //       console.log(res.data);
    //       this.projectAc = res.data;
    //     });
    //   }
    // },
    // detail(item) {
    //   this.finishtime = new Date().toISOString().slice(0, 10);
    //   this.detailDialog = true;
    //   this.tmp = item;
    //   getProjectDc(item.id, this.finishtime).then(res => {
    //     console.log(res.data);
    //     this.dclist = res.data;
    //   });
    //   computeProjectAc(item.id, this.finishtime).then(res => {
    //     console.log(res.data);
    //     this.projectAc = res.data;
    //   });
    // },
    // changeStatus(val) {
    //   this.loading = true;
    //   if (val) {
    //     listUnfinishProject(this.uid).then(res => {
    //       this.list = res.data;
    //       this.loading = false;
    //     });
    //   } else {
    //     listfinishProject(this.uid).then(res => {
    //       this.list = res.data;
    //       this.loading = false;
    //     });
    //   }
    // },
    // modify(item) {
    //   console.log(item);
    //   this.dialog = true;
    //   this.$nextTick(() => {
    //     console.log(item);
    //     this.projectform.name = item.name;
    //     this.projectform.id = item.id;
    //     this.projectform.dates.push(item.beginTime);
    //     this.projectform.dates.push(item.endTime);
    //     this.userlist = item.projectDetails.map(x => {
    //       return x.user;
    //     });
    //     this.projectform.dingIds = item.projectDetails.map(x => {
    //       return x.user.userid;
    //     });
    //   });
    // },
    // clearProjectForm() {
    //   console.log("close");
    //   this.$refs.projectform.resetFields();
    //   this.userlist = [];
    // },

    // deleteProject(id) {
    //   this.$confirm("此操作将删除开发任务, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   })
    //     .then(() => {
    //       deleteProject(id).then(() => {
    //         listUnfinishProject(this.uid).then(res => {
    //           this.list = res.data;
    //         });
    //         this.$message({
    //           type: "success",
    //           message: "删除成功!"
    //         });
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },

    // closeTag(u) {
    //   this.projectform.updateDingIds = true;
    //   this.userlist.splice(this.userlist.indexOf(u), 1);
    //   this.projectform.dingIds.splice(
    //     this.projectform.dingIds.indexOf(u.userid),
    //     1
    //   );
    // },
  }
};
</script>
<style lang="scss" scoped>
.project /deep/ .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 0px;
}
.project /deep/ .el-dialog__title {
  // padding-top: 5px;
  // padding-bottom: 5px;
  font-size: 14px;
}
.list /deep/ .el-card__body {
  padding-right: 15px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 750px;
}

.item {
  margin: 5px 5px 5px 0;
  height: 125px;
  width: 49%;
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
