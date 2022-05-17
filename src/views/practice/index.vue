<template>
  <div class="app-container">
    <div class="practiceWrap">
      <div class="practiceBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="currentOperation='申请实习'; addPracticeDialogVisible=true">申请实习
        </el-button>
        <div class="practiceList">
          <el-table :data="practiceList" fit highlight-current-row class="tableClass">
            <el-table-column label="实习单位" width="250px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.companyName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实习部门" width="250px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.department }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="250px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.start }} → {{ row.end }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100px" align="center">
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
            <el-table-column v-show="uid === 38" label="申请人" width="100px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.user.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150px" fixed="right" align="center">
              <template slot-scope="{ row }">
                <el-tooltip
                  v-show="row.state !== 1 && uid !== 38"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" @click="modifyPractice(row)" />
                </el-tooltip>
                <el-tooltip
                  v-show="uid === 38"
                  effect="dark"
                  content="通过"
                  placement="top"
                >
                  <el-button class="modifyBtn" type="success" icon="el-icon-check" size="mini" @click="acceptPractice(row)" />
                </el-tooltip>
                <el-tooltip
                  v-show="uid === 38"
                  effect="dark"
                  content="拒绝"
                  placement="top"
                >
                  <el-button class="modifyBtn" type="danger" icon="el-icon-close" size="mini" @click="rejectPractice(row)" />
                </el-tooltip>
                <el-button v-show="row.state === 1 && uid !== 38" class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" disabled />
                <el-tooltip
                  v-show="uid !== 38"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteWholePractice(row.id)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      :title="currentOperation"
      :visible.sync="addPracticeDialogVisible"
      width="38%"
      :before-close="clearBeforeClose"
    >
      <el-form ref="addPracticeForm" :model="addPracticeForm" :rules="rules" label-width="100px" style="margin-left: 36px">
        <el-form-item prop="companyName" label="实习单位:">
          <el-col :span="12">
            <el-input v-model="addPracticeForm.companyName" placeholder="请输入实习单位" style="width: 350px" />
          </el-col>
        </el-form-item>
        <el-form-item prop="department" label="实习部门:">
          <el-col :span="12">
            <el-input v-model="addPracticeForm.department" placeholder="请输入实习部门" style="width: 350px" />
          </el-col>
        </el-form-item>
        <el-form-item prop="practiceTime" label="实习时间:">
          <el-col :span="12">
            <el-date-picker
              v-model="addPracticeForm.practiceTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @blur="applyTime"
            />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddPractice">取 消</el-button>
        <el-button type="primary" @click="addNewPractice('addPracticeForm')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPracticeList, deletePractice, addPractice } from '@/api/practice'
export default {
  name: 'Index',
  data() {
    return {
      practiceList: [],
      addPracticeDialogVisible: false,
      currentOperation: '申请实习',
      addPracticeForm: {
        id: null,
        companyName: '',
        department: '',
        practiceTime: [],
        start: null,
        end: null
      },
      rules: {
        companyName: [{ required: true, message: '请输入实习单位', trigger: 'blur' }],
        department: [{ required: true, message: '请输入实习部门', trigger: 'blur' }],
        practiceTime: [{ required: true, message: '请选择实习时间', trigger: 'blur' }]
      },
      uid: -1,
      role: ''
    }
  },
  created() {
    this.fetchPractice()
    this.uid = parseInt(sessionStorage.getItem('uid'))
    this.role = parseInt(sessionStorage.getItem('role'))
  },
  methods: {
    // 分页获取实习
    fetchPractice() {
      // console.log(this.practiceList)
      return new Promise((resolve, reject) => {
        getPracticeList()
          .then(res => {
            this.practiceList = res.data
            console.log(res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    deleteWholePractice(id) {
      deletePractice(id).then(() => {
        this.$message.success('删除成功')
        this.fetchPractice()
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    applyTime() {
      if (this.addPracticeForm.practiceTime != null) {
        this.addPracticeForm.start = this.addPracticeForm.practiceTime[0]
        this.addPracticeForm.end = this.addPracticeForm.practiceTime[1]
      }
    },
    addNewPractice(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addPractice(this.addPracticeForm).then(() => {
            if (this.currentOperation === '申请实习') {
              this.$message.success('申请成功')
            } else if (this.currentOperation === '修改实习') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddPractice()
            this.fetchPractice()
          }).catch(err => {
            if (this.currentOperation === '申请实习') {
              this.$message.error('申请失败')
            } else if (this.currentOperation === '修改实习') {
              this.$message.error('修改失败')
            } else {
              this.$message.error('未知的状态！')
            }
            console.log(err)
          })
        } else {
          this.$notify({
            title: '添加失败',
            message: '请填写必要信息',
            type: 'warning'
          })
        }
      })
    },
    modifyPractice(row) {
      this.currentOperation = '修改实习'
      this.addPracticeForm.id = row.id
      this.addPracticeForm.companyName = row.companyName
      this.addPracticeForm.department = row.department
      this.addPracticeForm.start = row.start
      this.addPracticeForm.end = row.end
      this.addPracticeForm.practiceTime = [row.start, row.end]
      this.addPracticeDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addPracticeForm = {
        id: null,
        companyName: '',
        department: '',
        start: null,
        end: null,
        practiceTime: []
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
        practiceTime: []
      }
    },
    acceptPractice(row) {
      const acceptForm = {
        id: row.id,
        state: 1,
        companyName: row.companyName,
        department: row.department,
        practiceTime: row.practiceTime,
        start: row.start,
        end: row.end
      }
      addPractice(acceptForm).then(res => {
        if (res) {
          this.$notify.success('申请已通过！')
          this.fetchPractice()
        }
      }).catch(err => {
        this.$notify.error('申请通过失败!')
        console.log(err)
      })
    },
    rejectPractice(row) {
      const rejectForm = {
        id: row.id,
        state: -1,
        companyName: row.companyName,
        department: row.department,
        practiceTime: row.practiceTime,
        start: row.start,
        end: row.end
      }
      addPractice(rejectForm).then(res => {
        if (res) {
          this.$notify.success('申请已拒绝！')
          this.fetchPractice()
        }
      }).catch(err => {
        this.$notify.error('申请拒绝失败!')
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
</style>
