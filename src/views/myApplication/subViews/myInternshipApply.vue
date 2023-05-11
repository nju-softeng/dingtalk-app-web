<template>
  <div class="app-container">
    <div class="practiceWrap">
      <div class="practiceBox">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 5px; float: left;"
          @click="
            currentOperation = '申请实习';
            addPracticeDialogVisible = true;
          "
          >申请实习
        </el-button>

        <div style="margin: 5px; float: right;">
          <span style="font: 12px Extra Small">推荐实习时间段：</span>
          <el-tooltip placement="top">
            <div slot="content">
              推荐时间段内的实习申请会快速通过，无需审核
              <br />
              实习状态下无需填写周报
            </div>
            <span style="align-self: center; margin-right: 5px">
              <svg-icon icon-class="hint"
            /></span>
          </el-tooltip>
          <el-date-picker
            disabled
            v-model="internshipPeriod"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            popper-class="global-date-style"
            style="margin: 5px;"
          />
        </div>
        <div class="practiceList">
          <el-table
            :data="practiceList"
            fit
            highlight-current-row
            class="tableClass"
          >
            <el-table-column label="状态" align="center">
              <template slot="header" slot-scope="scope">
                <el-dropdown @command="filterTag">
                  <span class="el-dropdown-link">
                    状态<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="-2">全部</el-dropdown-item>
                    <el-dropdown-item :command="-1">拒绝</el-dropdown-item>
                    <el-dropdown-item :command="0">审核中</el-dropdown-item>
                    <el-dropdown-item :command="1">通过</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="{ row }">
                <el-tag v-if="row.state === 0" class="practiceTag"
                  >审核中</el-tag
                >
                <el-tag
                  v-else-if="row.state === 1"
                  class="practiceTag"
                  type="success"
                  >审核通过</el-tag
                >
                <el-tag
                  v-else-if="row.state === -1"
                  class="practiceTag"
                  type="danger"
                  >审核不通过</el-tag
                >
                <el-tag v-else class="practiceTag" type="danger"
                  >{{ row.state }}未知状态</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="实习单位" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.companyName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实习部门" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.department }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="200px">
              <template slot-scope="{ row }">
                <span>{{ row.start }} → {{ row.end }}</span>
              </template>
            </el-table-column>

            <el-table-column label="申请人" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.user.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="110px"
              fixed="right"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button
                    class="modifyBtn"
                    type="primary"
                    icon="el-icon-s-operation"
                    size="mini"
                    :disabled="!(row.state !== 1 && uid === row.user.id)"
                    @click="_modifyPractice(row)"
                  />
                </el-tooltip>
                <el-tooltip
                  v-show="uid === row.user.id"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    class="deleteBtn"
                    type="danger"
                    icon="el-icon-delete-solid"
                    size="mini"
                    @click="deleteWholePractice(row.id)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align:center; margin-top:5px">
          <el-pagination
            background
            :current-page="currentPage"
            :hide-on-single-page="total < 10 ? true : false"
            small
            layout="prev, pager, next"
            :total="total"
            :page-size="10"
            @prev-click="handlePrev"
            @next-click="handleNext"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="currentOperation"
      :visible.sync="addPracticeDialogVisible"
      width="400px"
      :before-close="clearBeforeClose"
    >
      <el-form ref="addPracticeForm" :model="addPracticeForm" :rules="rules">
        <el-form-item prop="companyName" label="实习单位:">
          <el-input
            v-model="addPracticeForm.companyName"
            placeholder="请输入实习单位"
          />
        </el-form-item>
        <el-form-item prop="department" label="实习部门:">
          <el-input
            v-model="addPracticeForm.department"
            placeholder="请输入实习部门"
          />
        </el-form-item>
        <el-form-item prop="practiceTime" label="实习时间:">
          <el-date-picker
            :disabled="currentOperation === '修改实习'"
            v-model="addPracticeForm.practiceTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            popper-class="global-date-style"
            @blur="applyTime"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddPractice">取 消</el-button>
        <el-button type="primary" @click="addNewPractice('addPracticeForm')"
          >确 认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkPermission, permissionEnum } from "@/utils/permission";
import {
  queryPracticeList,
  deletePractice,
  addPractice,
  addPracticeV2,
  modifyPractice,
} from "@/api/practice";
import { addPeriod, getPeriod } from "@/api/internshipPeriod";
export default {
  name: "Index",
  data() {
    return {
      practiceList: [],
      addPracticeDialogVisible: false,
      currentOperation: "申请实习",
      addPracticeForm: {
        id: null,
        companyName: "",
        department: "",
        practiceTime: [],
        start: null,
        end: null,
        userId: parseInt(sessionStorage.getItem("uid")),
      },
      rules: {
        companyName: [
          { required: true, message: "请输入实习单位", trigger: "blur" },
        ],
        department: [
          { required: true, message: "请输入实习部门", trigger: "blur" },
        ],
        practiceTime: [
          { required: true, message: "请选择实习时间", trigger: "blur" },
        ],
      },
      uid: -1,
      role: "",
      query: {
        userId: sessionStorage.getItem("uid"),
        state: -2,
      },
      currentPage: 1,
      total: 0,
      internshipPeriod: [],
    };
  },
  created() {
    this.currentPage = 1;
    this.fetchPractice(1);
    this.getInternshipPeriod();
    this.uid = parseInt(sessionStorage.getItem("uid"));
    // this.role = parseInt(sessionStorage.getItem("role"));
  },
  methods: {
    hasAuth() {
      return checkPermission(permissionEnum.REVIEW_INTERNSHIP_APPLICATION);
    },
    // 分页获取实习
    fetchPractice(page) {
      // console.log(this.practiceList)
      this.currentPage = page;
      //   return new Promise((resolve, reject) => {
      //     getPracticeList()
      //       .then((res) => {
      //         this.practiceList = res.data;
      //         console.log(res);
      //         resolve(res);
      //       })
      //       .catch((err) => {
      //         reject(err);
      //       });
      //   });
      queryPracticeList(page, 10, this.query)
        .then((res) => {
          this.practiceList = res.data.data.list;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteWholePractice(id) {
      deletePractice(id)
        .then(() => {
          this.$message.success("删除成功");
          this.fetchPractice(this.currentPage);
        })
        .catch(() => {
          this.$message.error("删除失败");
        });
    },
    applyTime() {
      if (this.addPracticeForm.practiceTime != null) {
        this.addPracticeForm.start = this.addPracticeForm.practiceTime[0];
        this.addPracticeForm.end = this.addPracticeForm.practiceTime[1];
      }
    },
    addNewPractice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentOperation == "申请实习") {
            addPracticeV2(this.addPracticeForm)
              .then((res) => {
                if (res.data.code === 0) {
                  this.$message.success(res.data.data);
                  this.cancelAddPractice();
                  this.fetchPractice(1);
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch((err) => {
                this.$message.error("网络开小差了~");
                console.log(err);
              });
          } else if (this.currentOperation === "修改实习") {
            modifyPractice(this.addPracticeForm)
              .then((res) => {
                if (res.data.code === 0) {
                  this.$message.success(res.data.data);
                  this.cancelAddPractice();
                  this.fetchPractice(1);
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch((err) => {
                this.$message.error("网络开小差了~");
                console.log(err);
              });
          }
        } else {
          this.$notify({
            title: "添加失败",
            message: "请填写必要信息",
            type: "warning",
          });
        }
      });
    },
    _modifyPractice(row) {
      this.currentOperation = "修改实习";
      this.addPracticeForm.id = row.id;
      this.addPracticeForm.companyName = row.companyName;
      this.addPracticeForm.department = row.department;
      this.addPracticeForm.start = row.start;
      this.addPracticeForm.end = row.end;
      this.addPracticeForm.practiceTime = [row.start, row.end];
      this.addPracticeDialogVisible = true;
    },
    clearBeforeClose(done) {
      this.addPracticeForm = {
        id: null,
        companyName: "",
        department: "",
        start: null,
        end: null,
        practiceTime: [],
        userId: parseInt(sessionStorage.getItem("uid")),
      };
      return done(true);
    },
    cancelAddPractice() {
      this.addPracticeDialogVisible = false;
      this.addPracticeForm = {
        id: null,
        companyName: "",
        department: "",
        start: null,
        end: null,
        practiceTime: [],
        userId: parseInt(sessionStorage.getItem("uid")),
      };
    },
    filterTag(command) {
      console.log(command);
      (this.query = {
        userId: sessionStorage.getItem("uid"),
        state: command,
      }),
        this.fetchPractice(1);
    },
    handlePrev(val) {
      this.fetchPractice(val);
    },
    // 下一页
    handleNext(val) {
      this.fetchPractice(val);
    },
    // 分页获取数据
    handleCurrentChange(val) {
      if (val === this.currentPage) return;
      this.fetchPractice(val);
    },
    getInternshipPeriod() {
      getPeriod()
        .then((res) => {
          if (res.data.code === 0) {
            this.internshipPeriod = [res.data.data.start, res.data.data.end];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #8997a5;
  font-size: 12px;
}
.practiceList {
  min-height: 500px;
}

.modifyBtn {
  padding: 2px 6px;
  border-radius: 5px;
  margin-left: 16px;
}

.deleteBtn {
  padding: 2px 6px;
  border-radius: 5px;
  margin-left: 16px;
}
</style>

<style>
/* 解决日期选择器太宽 */
.el-range-editor--mini.el-input__inner {
  height: 28px;
  width: 230px !important;
}
</style>
