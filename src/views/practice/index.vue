<template>
  <div class="app-container">
    <div class="practiceWrap">
      <div class="practiceBox">
        <div style="margin: 5px;">
          <span style="font: 12px Extra Small">推荐实习时间段：</span>
          <el-tooltip placement="top">
            <div slot="content">
              推荐时间段内的实习申请会快速通过，无需审核
              <br>
              实习状态下无需填写周报
            </div>
            <span style="align-self: center; margin-right: 5px">
              <svg-icon
                icon-class="hint"
              /></span>
          </el-tooltip>
          <el-date-picker
            v-model="internshipPeriod"
            :disabled="editPeriodButtonVisible"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            popper-class="global-date-style"
            style="margin: 5px;"
          />
          <el-button
            v-if="editPeriodButtonVisible"
            type="primary"
            plain
            size="mini"
            style="margin: 5px;"
            @click="editPeriodButtonVisible = false"
          >修改</el-button>
          <el-button
            v-if="!editPeriodButtonVisible"
            type="success"
            plain
            size="mini"
            style="margin: 5px;"
            @click="submitPeriod"
          >提交</el-button>
          <el-button
            v-if="!editPeriodButtonVisible"
            type="danger"
            plain
            size="mini"
            style="margin: 5px;"
            @click="
              {
                editPeriodButtonVisible = true;
                getInternshipPeriod();
              }
            "
          >取消</el-button>
        </div>

        <div class="practiceList">
          <el-table
            :data="practiceList"
            fit
            highlight-current-row
            class="tableClass"
          >
            <el-table-column label="状态" align="center">
              <template slot="header">
                <el-dropdown @command="filterTag">
                  <span class="el-dropdown-link">
                    状态<i class="el-icon-arrow-down el-icon--right" />
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
                <el-tag
                  v-if="row.state === 0"
                  class="practiceTag"
                >审核中</el-tag>
                <el-tag
                  v-else-if="row.state === 1"
                  class="practiceTag"
                  type="success"
                >审核通过</el-tag>
                <el-tag
                  v-else-if="row.state === -1"
                  class="practiceTag"
                  type="danger"
                >审核不通过</el-tag>
                <el-tag
                  v-else
                  class="practiceTag"
                  type="danger"
                >{{ row.state }}未知状态</el-tag>
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
                <el-popover placement="top" trigger="hover" width="200">
                  <el-descriptions title="用户信息" :column="1">
                    <el-descriptions-item label="学号">{{
                      row.user.stuNum == null ? "未设置" : row.user.stuNum
                    }}</el-descriptions-item>
                    <el-descriptions-item label="实习状态">{{
                      row.user.workState == null
                        ? "未设置"
                        : row.user.workState
                          ? "实习"
                          : "在校"
                    }}</el-descriptions-item>
                    <el-descriptions-item label="职位">{{
                      row.user.position == null ? "未设置" : row.user.position
                    }}</el-descriptions-item>
                    <el-descriptions-item label="所属研究组">
                      <el-tag
                        v-if="row.user.teamList.length === 0"
                        type="info"
                        effect="plain"
                        class="team-tag"
                        size="mini"
                      >未设置</el-tag>
                      <el-tag
                        v-for="tag in row.user.teamList"
                        :key="tag.id"
                        class="team-tag"
                        size="mini"
                      >
                        {{ tag.name }}
                      </el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                  <span slot="reference">{{ row.user.name }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="110px"
              fixed="right"
              align="center"
            >
              <template slot-scope="{ row }">
                <!-- <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button
                    class="modifyBtn"
                    type="primary"
                    icon="el-icon-s-operation"
                    size="mini"
                    :disabled="!(row.state !== 1 && uid === row.user.id)"
                    @click="_modifyPractice(row)"
                  />
                </el-tooltip> -->
                <el-tooltip
                  v-show="hasAuth()"
                  effect="dark"
                  content="通过"
                  placement="top"
                >
                  <el-button
                    class="modifyBtn"
                    type="success"
                    :disabled="row.state !== 0"
                    icon="el-icon-check"
                    size="mini"
                    @click="acceptPractice(row)"
                  />
                </el-tooltip>
                <el-tooltip
                  v-show="hasAuth()"
                  effect="dark"
                  content="拒绝"
                  placement="top"
                >
                  <el-button
                    class="modifyBtn"
                    type="danger"
                    icon="el-icon-close"
                    size="mini"
                    :disabled="row.state !== 0"
                    @click="rejectPractice(row)"
                  />
                </el-tooltip>
                <!-- <el-tooltip
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
                </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align:center; margin-top:5px">
            <el-pagination
              background
              :current-page="currentPage"
              :hide-on-single-page="total < 10"
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
            v-model="addPracticeForm.practiceTime"
            disabled
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
        <el-button
          type="primary"
          @click="editPractice('addPracticeForm')"
        >确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkPermission, permissionEnum } from '@/utils/permission'
import {
  queryPracticeList,
  deletePractice,
  modifyPractice
} from '@/api/practice'
import { addPeriod, getPeriod } from '@/api/internshipPeriod'
export default {
  name: 'Index',
  data() {
    return {
      practiceList: [],
      addPracticeDialogVisible: false,
      currentOperation: '修改实习',
      addPracticeForm: {
        id: null,
        companyName: '',
        department: '',
        practiceTime: [],
        start: null,
        end: null,
        userId: 0
      },
      rules: {
        companyName: [
          { required: true, message: '请输入实习单位', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入实习部门', trigger: 'blur' }
        ],
        practiceTime: [
          { required: true, message: '请选择实习时间', trigger: 'blur' }
        ]
      },
      uid: -1,
      role: '',
      query: {
        userId: 0,
        state: -2
      },
      currentPage: 1,
      total: 0,
      internshipPeriod: [],
      editPeriodButtonVisible: true
    }
  },
  created() {
    this.currentPage = 1
    this.fetchPractice(1)
    this.getInternshipPeriod()
    this.uid = parseInt(sessionStorage.getItem('uid'))
    // this.role = parseInt(sessionStorage.getItem("role"));
  },
  methods: {
    hasAuth() {
      return checkPermission(permissionEnum.REVIEW_INTERNSHIP_APPLICATION)
    },
    // 分页获取实习
    fetchPractice(page) {
      this.currentPage = page
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
          this.practiceList = res.data.data.list
          this.total = res.data.data.total
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteWholePractice(id) {
      deletePractice(id)
        .then(() => {
          this.$message.success('删除成功')
          this.fetchPractice(this.currentPage)
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    applyTime() {
      if (this.addPracticeForm.practiceTime != null) {
        this.addPracticeForm.start = this.addPracticeForm.practiceTime[0]
        this.addPracticeForm.end = this.addPracticeForm.practiceTime[1]
      }
    },
    editPractice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyPractice(this.addPracticeForm)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success(res.data.data)
                this.cancelAddPractice()
                this.fetchPractice(1)
              } else {
                this.$message.error(res.data.message)
              }
            })
            .catch((err) => {
              this.$message.error('网络开小差了~')
              console.log(err)
            })
        } else {
          this.$notify({
            title: '编辑失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    _modifyPractice(row) {
      this.currentOperation = '修改实习'
      this.addPracticeForm.id = row.id
      this.addPracticeForm.companyName = row.companyName
      this.addPracticeForm.department = row.department
      this.addPracticeForm.start = row.start
      this.addPracticeForm.end = row.end
      this.addPracticeForm.practiceTime = [row.start, row.end]
      this.addPracticeDialogVisible = true
      this.addPracticeForm.userId = row.user.id
    },
    clearBeforeClose(done) {
      this.addPracticeForm = {
        id: null,
        companyName: '',
        department: '',
        start: null,
        end: null,
        practiceTime: [],
        userId: 0
      }
      return done(true)
    },
    cancelAddPractice() {
      this.addPracticeDialogVisible = false
      this.addPracticeForm = {
        id: null,
        companyName: '',
        department: '',
        start: null,
        end: null,
        practiceTime: [],
        userId: 0
      }
    },
    acceptPractice(row) {
      const acceptForm = {
        id: row.id,
        state: 1,
        userId: row.user.id,
        companyName: row.companyName,
        department: row.department,
        practiceTime: row.practiceTime,
        start: row.start,
        end: row.end
      }
      console.log(acceptForm)
      modifyPractice(acceptForm)
        .then((res) => {
          if (res) {
            console.log(res.data.code)
            if (res.data.code !== 0) {
              this.$notify.warning(res.data.message)
            } else {
              this.$notify.success('申请已通过！')
              this.fetchPractice(this.currentPage)
            }
          }
        })
        .catch((err) => {
          this.$notify.error('申请通过失败!')
          console.log(err)
        })
    },
    rejectPractice(row) {
      const rejectForm = {
        id: row.id,
        state: -1,
        userId: row.user.id,
        companyName: row.companyName,
        department: row.department,
        practiceTime: row.practiceTime,
        start: row.start,
        end: row.end
      }
      console.log(rejectForm)
      modifyPractice(rejectForm)
        .then((res) => {
          if (res) {
            if (res.data.code !== 0) {
              this.$notify.warning(res.data.message)
            } else {
              this.$notify.success('申请已拒绝！')
              this.fetchPractice(this.currentPage)
            }
          }
        })
        .catch((err) => {
          this.$notify.error('申请拒绝失败!')
          console.log(err)
        })
    },
    filterTag(command) {
      console.log(command)
      this.query = {
        userId: 0,
        state: command
      }
      this.fetchPractice(1)
    },
    handlePrev(val) {
      this.fetchPractice(val)
    },
    // 下一页
    handleNext(val) {
      this.fetchPractice(val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      if (val === this.currentPage) return
      this.fetchPractice(val)
    },
    submitPeriod() {
      addPeriod({
        start: this.internshipPeriod[0],
        end: this.internshipPeriod[1],
        authorId: parseInt(sessionStorage.getItem('uid'))
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$notify.success(res.data.data)
            this.getInternshipPeriod()
            this.editPeriodButtonVisible = true
          } else {
            this.$notify.error(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$notify.error('网络开小差了~')
        })
    },
    getInternshipPeriod() {
      getPeriod()
        .then((res) => {
          if (res.data.code === 0) {
            this.internshipPeriod = [res.data.data.start, res.data.data.end]
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  align-content: center;
  padding: 0 12px;
  background-color: #fafafa;
  border-radius: 0;
}

.practiceWrap {
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  width: 80%;
}

.practiceBox {
  background: #fff;
  padding: 10px 15px;
  min-height: 540px;
}

@media only screen and (min-width: 1400px) {
  .practiceBox {
    max-width: 1305px !important;
  }
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

.el-dropdown-link {
  cursor: pointer;
  color: #8997a5;
  font-size: 12px;
}
.team-tag {
  margin: 2px 5px;
}
</style>

<style>
/* 解决日期选择器太宽 */
.el-range-editor--mini.el-input__inner {
  height: 28px;
  width: 230px !important;
}
</style>
