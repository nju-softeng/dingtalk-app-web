<template>
  <div class="app-container">
    <div class="vmWrap">
      <div class="vmBox">
        <div class="vmList">
          <el-table
            :data="vmList"
            fit
            highlight-current-row
            style="max-height: 500px"
          >
            <el-table-column align="center">
              <template slot="header">
                <el-dropdown @command="filterTag">
                  <span class="el-dropdown-link">
                    状态<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="-2">全部</el-dropdown-item>
                    <el-dropdown-item :command="0">审核中</el-dropdown-item>
                    <el-dropdown-item :command="1">通过</el-dropdown-item>
                    <el-dropdown-item :command="-1">不通过</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="{ row }">
                <el-tag v-if="row.state === 0" class="vmTag">审核中</el-tag>
                <el-tag
                  v-else-if="row.state === 1"
                  class="vmTag"
                  type="success"
                >审核通过</el-tag>
                <el-tag
                  v-else-if="row.state === -1"
                  class="vmTag"
                  type="danger"
                >审核不通过</el-tag>
                <el-tag
                  v-else
                  class="vmTag"
                  type="danger"
                >{{ row.state }}未知状态</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="项目组" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.projectTeam }}</span>
              </template>
            </el-table-column>
            <el-table-column label="课题" align="center" min-width="300px">
              <template slot-scope="{ row }">
                <span>{{ row.subject }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="200px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.start }} → {{ row.end }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请日期" width="100px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.applyDate }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="hasAuth()" label="申请人" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.user.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="120px"
              fixed="right"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tooltip effect="dark" content="详情" placement="top">
                  <el-button
                    class="modifyBtn"
                    type="primary"
                    icon="el-icon-s-operation"
                    size="mini"
                    @click="getVMDetail(row)"
                  />
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button
                    :disabled="uid !== row.user.id"
                    class="deleteBtn"
                    type="danger"
                    icon="el-icon-delete-solid"
                    size="mini"
                    @click="deleteWholeVM(row.id)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
            <div style="text-align:center; margin-top:5px">
              <el-pagination
                background
                :hide-on-single-page="total < 10"
                small
                layout="prev, pager, next"
                :total="total"
                :page-size="10"
                :current-page="currentPage"
                @prev-click="handlePrev"
                @next-click="handleNext"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog
      :title="currentOperation"
      :visible.sync="addVirtualMachineApplyDialogVisible"
      width="400px"
      :before-close="clearBeforeClose"
    >
      <el-form
        ref="addVirtualMachineApplyForm"
        :model="addVirtualMachineApplyForm"
        :rules="rules"
        style=""
      >
        <el-form-item prop="projectTeam" label="项目组:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.projectTeam }}</span>
          <el-input
            v-else
            v-model="addVirtualMachineApplyForm.projectTeam"
            placeholder="请输入项目组"
          />
        </el-form-item>
        <el-form-item prop="subject" label="课题:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.subject }}</span>
          <el-input
            v-else
            v-model="addVirtualMachineApplyForm.subject"
            placeholder="请输入课题"
          />
        </el-form-item>
        <el-form-item prop="email" label="E-mail:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.email }}</span>
          <el-input
            v-else
            v-model="addVirtualMachineApplyForm.email"
            placeholder="请输入E-mail"
          />
        </el-form-item>
        <el-form-item prop="vmTime" label="虚拟机时间:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.start }} 至 {{ tempForm.end }}</span>
          <el-date-picker
            v-else
            v-model="addVirtualMachineApplyForm.vmTime"
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
        <el-form-item prop="purpose" label="申请用途:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.purpose }}</span>
          <el-input
            v-else
            v-model="addVirtualMachineApplyForm.purpose"
            placeholder="请输入申请用途"
          />
        </el-form-item>
        <el-form-item prop="coreNum" label="CPU核心数:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.coreNum }}</span>
          <el-input
            v-else
            v-model.number="addVirtualMachineApplyForm.coreNum"
            placeholder="请输入CPU核心数"
          />
        </el-form-item>
        <el-form-item prop="memory" label="内存大小:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.memory }}</span>
          <el-input
            v-else
            v-model.number="addVirtualMachineApplyForm.memory"
            placeholder="请输入内存大小，单位为GB"
            style="width: 250px; display: inline-block"
          />
          <span style="display: inline; font-weight: bolder"> GB</span>
        </el-form-item>
        <el-form-item prop="capacity" label="硬盘容量:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.capacity }}</span>
          <el-input
            v-else
            v-model.number="addVirtualMachineApplyForm.capacity"
            placeholder="请输入硬盘容量，单位为GB"
            style="width: 250px; display: inline-block"
          />
          <span style="display: inline; font-weight: bolder"> GB</span>
        </el-form-item>
        <el-form-item prop="operationSystem" label="操作系统:">
          <span
            v-if="currentOperation === '查看虚拟机'"
            style="font-weight: bold;"
          >{{ tempForm.operationSystem }}</span>
          <el-input
            v-else
            v-model="addVirtualMachineApplyForm.operationSystem"
            placeholder="请输入操作系统"
            style="width: 350px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          v-if="currentOperation === '编辑虚拟机'"
          @click="cancelModifyVM"
        >取 消</el-button>
        <el-button
          v-else-if="currentOperation === '申请虚拟机'"
          @click="cancelAddVM"
        >取 消</el-button>
        <el-button
          v-if="currentOperation === '查看虚拟机'"
          type="primary"
          :disabled="
            !(
              tempForm.state === 0 && uid === addVirtualMachineApplyForm.user.id
            )
          "
          @click="modifyVM"
        >编 辑</el-button>
        <el-button
          v-else-if="
            (currentOperation === '编辑虚拟机' &&
              uid === addVirtualMachineApplyForm.user.id) ||
              currentOperation === '申请虚拟机'
          "
          type="primary"
          @click="addNewVM('addVirtualMachineApplyForm')"
        >确 认</el-button>
        <el-button
          v-if="currentOperation === '查看虚拟机' && hasAuth()"
          type="success"
          @click="acceptVM(tempForm)"
        >通 过</el-button>
        <el-button
          v-if="currentOperation === '查看虚拟机' && hasAuth()"
          type="danger"
          @click="rejectVM(tempForm)"
        >拒 绝</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addVirtualMachineApply,
  setVMApplyResult,
  deleteVMApply,
  queryVMApplyList
} from '@/api/vm'
import { checkPermission, permissionEnum } from '@/utils/permission'
export default {
  name: 'Vm',
  data() {
    return {
      vmList: [],
      addVirtualMachineApplyDialogVisible: false,
      currentOperation: '申请虚拟机',
      addVirtualMachineApplyForm: {
        id: null,
        // 项目组
        projectTeam: '',
        // 课题
        subject: '',
        // email
        email: '',
        vmTime: [],
        // 开始时间
        start: null,
        // 结束时间
        end: null,
        // 申请用途
        purpose: '',
        // CPU核心数
        coreNum: null,
        // 内存大小 GB为单位
        memory: null,
        // 硬盘容量 GB为单位
        capacity: null,
        // 操作系统
        operationSystem: '',
        user: {
          id: 0
        }
      },
      rules: {
        projectTeam: [
          { required: true, message: '请输入项目组', trigger: 'blur' }
        ],
        subject: [{ required: true, message: '请输入课题', trigger: 'blur' }],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        vmTime: [
          { required: true, message: '请选择虚拟机时间', trigger: 'blur' }
        ],
        purpose: [
          { required: true, message: '请输入申请用途', trigger: 'blur' }
        ],
        coreNum: [
          {
            required: true,
            type: 'integer',
            min: 1,
            message: '请输入CPU核心数',
            trigger: 'blur'
          }
        ],
        memory: [
          {
            required: true,
            type: 'integer',
            min: 1,
            message: '请输入内存大小',
            trigger: 'blur'
          }
        ],
        capacity: [
          {
            required: true,
            type: 'integer',
            min: 1,
            message: '请输入硬盘容量',
            trigger: 'blur'
          }
        ],
        operationSystem: [
          { required: true, message: '请输入操作系统', trigger: 'blur' }
        ]
      },
      uid: -1,
      role: '',
      tempForm: {},
      total: 0,
      currentPage: 1,
      vmListFilter: {
        projectTeam: '',
        userId: 0,
        state: -2
      }
    }
  },
  created() {
    this.uid = parseInt(sessionStorage.getItem('uid'))
    this.fetchVMList(1)
  },
  methods: {
    hasAuth() {
      return checkPermission(permissionEnum.REVIEW_VM_DEVICE_APPLICATION)
    },
    deleteWholeVM(id) {
      deleteVMApply(id)
        .then(() => {
          this.$message.success('删除成功')
          // this.fetchVM();
          this.fetchVMList(1)
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    applyTime() {
      if (this.addVirtualMachineApplyForm.vmTime != null) {
        this.addVirtualMachineApplyForm.start = this.addVirtualMachineApplyForm.vmTime[0]
        this.addVirtualMachineApplyForm.end = this.addVirtualMachineApplyForm.vmTime[1]
      }
    },
    addNewVM(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addVirtualMachineApply(this.addVirtualMachineApplyForm)
            .then(() => {
              if (this.currentOperation === '申请虚拟机') {
                this.$message.success('申请成功')
              } else if (this.currentOperation === '编辑虚拟机') {
                this.$message.success('修改成功')
              } else {
                this.$message.error('未知的状态！')
              }
              this.cancelAddVM()
              this.fetchVMList(1)
            })
            .catch((err) => {
              if (this.currentOperation === '申请虚拟机') {
                this.$message.error('申请失败')
              } else if (this.currentOperation === '编辑虚拟机') {
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
    getVMDetail(row) {
      this.currentOperation = '查看虚拟机'
      this.addVirtualMachineApplyForm = row
      this.addVirtualMachineApplyForm.vmTime = [row.start, row.end]
      this.addVirtualMachineApplyDialogVisible = true
      this.tempForm = this.addVirtualMachineApplyForm
    },
    modifyVM() {
      this.currentOperation = '编辑虚拟机'
    },
    clearBeforeClose(done) {
      this.addVirtualMachineApplyForm = {
        id: null,
        projectTeam: '',
        subject: '',
        email: '',
        vmTime: [],
        start: null,
        end: null,
        purpose: '',
        coreNum: null,
        memory: null,
        capacity: null,
        operationSystem: '',
        user: {
          id: 0
        }
      }
      return done(true)
    },
    cancelModifyVM() {
      this.currentOperation = '查看虚拟机'
    },
    cancelAddVM() {
      this.addVirtualMachineApplyDialogVisible = false
      this.addVirtualMachineApplyForm = {
        id: null,
        projectTeam: '',
        subject: '',
        email: '',
        vmTime: [],
        start: null,
        end: null,
        purpose: '',
        coreNum: null,
        memory: null,
        capacity: null,
        operationSystem: '',
        user: {
          id: 0
        }
      }
    },
    acceptVM(row) {
      setVMApplyResult(row.id, true)
        .then((res) => {
          if (res) {
            this.$notify.success('申请已通过！')
            this.fetchVMList(1)
            this.addVirtualMachineApplyDialogVisible = false
          }
        })
        .catch((err) => {
          this.$notify.error('申请通过失败!')
          console.log(err)
        })
    },
    rejectVM(row) {
      setVMApplyResult(row.id, false)
        .then((res) => {
          if (res) {
            this.$notify.success('申请已拒绝！')
            // this.fetchVM();
            this.fetchVMList(1)
            this.addVirtualMachineApplyDialogVisible = false
          }
        })
        .catch((err) => {
          this.$notify.error('申请拒绝失败!')
          console.log(err)
        })
    },
    // 分页获取数据
    handleCurrentChange(val) {
      if (val === this.currentPage) return
      this.fetchVMList(val)
    },
    // 上一页
    handlePrev(val) {
      this.fetchVMList(val)
    },
    // 下一页
    handleNext(val) {
      this.fetchVMList(val)
    },
    fetchVMList(page) {
      this.currentPage = page
      queryVMApplyList(page, 10, this.vmListFilter).then((res) => {
        this.vmList = res.data.data.list
        this.total = res.data.data.total
      })
    },
    filterTag(command) {
      console.log(command)
      this.vmListFilter = {
        projectTeam: '',
        userId: 0,
        state: command
      }
      this.fetchVMList(1)
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

.vmWrap {
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  width: 80%;
}

.vmBox {
  background: #fff;
  padding: 10px 15px;
  min-height: 540px;
}

@media only screen and (min-width: 1400px) {
  .vmBox {
    max-width: 1305px !important;
  }
}

.vmList {
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
</style>
