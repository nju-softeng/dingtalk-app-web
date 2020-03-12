<template>
  <div class="project">
    <div class="list" v-loading="loading">
      <div v-if="list.length == 0" style="margin-left: auto;margin-right: auto; padding-top:100px">
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
          <span>时间: {{ item.beginTime }} ~ {{ item.endTime }}</span>
          <span style="padding:15px; color:#67C23A" v-if="getRemainDay(item.endTime) >= 0">
            按时完成</span>
          <span style="padding:15px; color:#F56C6C" v-else> 延期完成</span>
        </p>
        <div>
          <el-tag style="margin-right:5px" size="small" v-for="(pd, index) in item.projectDetails" :key="index">{{ pd.user.name }} : + {{ pd.ac }}</el-tag>
          <el-button style="float:right" @click="detail(item)" size="mini">修改</el-button>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="detailDialog" width="70%">
      <div slot="title">
        <span class="title-age">{{ tmp.name }} </span>
      </div>

      <div>开始时间 : {{ tmp.beginTime }}</div>

      <el-card v-loading="dcloading" class="box-card" shadow="never" style="margin-top:5px;">
        <div style="padding-bottom:10px">
          完成时间:
          <el-date-picker value-format="yyyy-MM-dd" v-model="finishtime" type="date" style="width:180px" :default-value="this.finishtime" @change="changeftime" placeholder="选择日期">
          </el-date-picker>
        </div>
        AC 分配 :
        <el-radio-group v-model="radio">
          <el-radio :label="1">默认方案</el-radio>

          <el-radio :label="2">自定义</el-radio>
        </el-radio-group>
        <div v-if="radio == 1" style="padding-top:5px;">
          <span style="color: rgba(0, 0, 0, 0.45);margin-top:5px;font-size:11px">系统根据公式: 𝐴_𝑖=𝐴_𝑎∗𝐷_𝑖/(∑𝐷)∗𝐷_𝑖/0.5 计算实际AC值</span>
          <div v-if="projectAc.valid" style="margin-top:10px">
            <div>
              <span>开发期间累计DC</span>
              <div class="projectdc">
                <el-card shadow="never" class="dcitem" v-for="(o, index) in dclist" :key="index">
                  <el-popover placement="bottom" width="180" trigger="hover">
                    <div style="text-align:center;" v-if="o.values.length == 0">
                      无DC数据
                    </div>
                    <ul>
                      <li v-for="(i, index) in o.values" :key="index">
                        {{ i.date }}: {{ i.dc }}
                      </li>
                    </ul>
                    <div slot="reference">
                      <div style="text-align:center;">{{ o.name }}</div>
                      <div style="text-align:center;">
                        {{ o.dctotal }}
                      </div>
                    </div>
                  </el-popover>
                </el-card>
              </div>
            </div>

            <p>
              <el-tooltip content="团队实际AC: 𝐴_𝑎=𝑛∗𝑚_𝑎/30" placement="top">
                <el-tag effect="plain" style="margin-right:10px;">
                  A_a : {{ projectAc.actualAc }}
                </el-tag>
              </el-tooltip>
              <el-tooltip content="团队成员平均DC之和" placement="top">
                <el-tag effect="plain" style="margin-right:10px;">
                  ∑𝐷 : {{ projectAc.totalDc }} /
                  {{ projectAc.week }}
                </el-tag>
              </el-tooltip>
              <el-tooltip content="迭代期间包含的周数，以周四为基准" placement="top">
                <el-tag effect="plain" style="margin-right:10px;">
                  开发周数：{{ projectAc.week }}
                </el-tag>
              </el-tooltip>
            </p>

            <el-table :data="projectAc.res">
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column label="D_i (个人平均DC)">
                <template slot-scope="scope">
                  {{ scope.row.dc }} / {{ projectAc.week }}
                </template>
              </el-table-column>
              <el-table-column prop="ac" label="A_i (个人实际AC)"></el-table-column>
            </el-table>

            <div style=" margin-top:5px">
              <el-button size="small" @click="SetAc(tmp.id)" type="primary" style="float:right">确认完成</el-button>
              <br />
            </div>
          </div>
          <div v-else style="margin-top:10px">
            <el-alert title="开发者的DC和为0，公式无法计算，请手动分配" type="error">
            </el-alert>
          </div>
        </div>
        <div v-if="radio == 2" style="margin-top:5px;margin-top:5px">
          <span style="color: rgba(0, 0, 0, 0.45); font-size:11px">审核人自定义开发者AC值</span>

          <div class="acinput">
            <el-form label-width="70px" label-position="left">
              <el-form-item v-for="(o, index) in tmp.projectDetails" :key="index" :label="o.user.name">
                <el-input v-model="o.ac" style="width:100px"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style=" margin-top:5px">
            <el-button size="small" @click="manualAc(tmp.id, tmp.projectDetails)" type="primary" style="float:right">确认完成</el-button>
            <br />
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import {
  addProject,
  listUnfinishProject,
  listfinishProject,
  deleteProject,
  getProjectDc,
  computeProjectAc,
  autoSetAc,
  manualSetAc
} from "@/api/project.js";
import { contactChoose } from "@/utils/dingtalk";

export default {
  data() {
    return {
      radio: "",
      finishtime: "",
      userlist: [],
      unfinish: true,
      dialog: false,
      list: [],
      loading: false,
      dcloading: false,
      uid: "",
      detailDialog: false,
      projectAc: {},
      projectform: {
        id: "",
        name: "",
        auditorid: "",
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
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        dates: [{ required: true, message: "请选择时间", trigger: "blur" }],
        dingIds: [{ required: true, message: "请分配任务", trigger: "blur" }]
      }
    };
  },
  created() {
    this.uid = sessionStorage.getItem("uid");
    listfinishProject(this.uid).then(res => {
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
    manualAc(pid, data) {
      manualSetAc(pid, data).then(() => {
        this.$notify({
          title: "成功",
          message: "修改项目状态成功",
          type: "success"
        });
        listUnfinishProject(this.uid).then(res => {
          this.list = res.data;
        });
      });
    },
    SetAc(pid) {
      autoSetAc(pid, this.finishtime).then(() => {
        this.$notify({
          title: "成功",
          message: "修改项目状态成功",
          type: "success"
        });
        listUnfinishProject(this.uid).then(res => {
          this.list = res.data;
        });
      });
    },
    changeftime() {
      if (this.finishtime) {
        getProjectDc(this.tmp.id, this.finishtime).then(res => {
          console.log(res.data);
          this.dclist = res.data;
        });
        computeProjectAc(this.tmp.id, this.finishtime).then(res => {
          console.log(res.data);
          this.projectAc = res.data;
        });
      }
    },
    detail(item) {
      this.finishtime = new Date().toISOString().slice(0, 10);
      this.detailDialog = true;
      this.tmp = item;
      getProjectDc(item.id, this.finishtime).then(res => {
        console.log(res.data);
        this.dclist = res.data;
      });
      computeProjectAc(item.id, this.finishtime).then(res => {
        console.log(res.data);
        this.projectAc = res.data;
      });
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
      this.$confirm("相关的绩效也会被删除, 请谨慎操作！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          deleteProject(id).then(() => {
            listfinishProject(this.uid).then(res => {
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
.project /deep/ .el-dialog__body {
  padding-top: 5px;
}

.project /deep/ .el-card__body {
  padding: 15px;
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
