<template>
  <div class="drawer">
    <!-- 添加迭代drawer -->
    <el-drawer size="90%" :visible.sync="drawer" direction="btt">
      <div slot="title">
        项目标题 2020-02-12 ~ 2020-03-12
      </div>
      <div class="content">
        <template>
          <el-card shadow="never" style="width:360px;margin-left: auto;margin-right:auto;height:70vh">
            <span style="font-size:14px">完成时间</span>
            <el-date-picker type="date" placeholder="选择日期">
            </el-date-picker>
          </el-card>
        </template>
        <!-- <div>
          <el-steps :active="active" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>   
        </div>
        <el-table :data="tableData" border show-summary style="width: 100%">
          <el-table-column prop="id" label="ID" width="180"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="amount1" sortable label="数值 1">
          </el-table-column>
          <el-table-column prop="amount2" sortable label="数值 2">
          </el-table-column>
          <el-table-column prop="amount3" sortable label="数值 3">
          </el-table-column>
        </el-table> -->
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { createIteration } from "@/api/project.js";

export default {
  props: ["show", "pid", "title", "cnt", "edit"],
  data() {
    return {
      userlist: [],
      list: [],
      loading: false,
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
        dates: [{ required: true, message: "请选择时间", trigger: "blur" }],
        dingIds: [{ required: true, message: "请分配任务", trigger: "blur" }]
      }
    };
  },

  computed: {
    drawer: {
      get() {
        return this.$store.state.project.finishdrawer;
      },
      set(value) {
        this.$store.commit("project/UPDATE_DRAWER", value);
      }
    }
  },
  methods: {
    // dialog 打开前渲染编辑数据
    toOpen() {
      if (this.edit != null) {
        this.$nextTick(() => {
          this.iterateform.dates.push(this.edit.beginTime);
          this.iterateform.dates.push(this.edit.endTime);
          this.userlist = this.edit.iterationDetails.map(x => {
            return x.user;
          });
          this.iterateform.dingIds = this.edit.iterationDetails.map(x => {
            return x.user.userid;
          });
          this.iterateform.id = this.edit.id;
        });
      }
    },
    // 创建或更新项目
    submitIterate() {
      this.$refs.iterateform.validate(valid => {
        if (valid) {
          this.loading = true;
          createIteration(this.pid, this.iterateform)
            .then(() => {
              this.dialog = false;
              this.$store.commit("project/TO_UPDATE");
              this.$notify({
                title: "成功",
                message: "提交成功",
                type: "success"
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

    // 取消选中的用户
    closeTag(u) {
      this.iterateform.updateDingIds = true;
      this.userlist.splice(this.userlist.indexOf(u), 1);
      this.iterateform.dingIds.splice(
        this.iterateform.dingIds.indexOf(u.userid),
        1
      );
    },
    handleClose() {
      this.$refs.iterateform.resetFields();
      this.userlist = [];
      this.iterateform.updateDingIds = false;
      this.iterateform.id = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.drawer .el-drawer > header > span:focus {
  outline-color: white;
}
.drawer .el-drawer > header > button:focus {
  outline-color: white;
}
.drawer .el-drawer > header > button:hover {
  color: rgb(64, 158, 255);
}

.content {
  padding: 20px;
  height: 100%;
}
</style>
