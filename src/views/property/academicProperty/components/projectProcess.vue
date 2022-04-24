<template>
  <div class="app-container">
    <div class="processWrap">
      <div class="processBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="currentOperation='添加会议'; addProcessDialogVisible=true">新建会议
        </el-button>
        <div class="processList">
          <el-table :data="processList" fit highlight-current-row class="tableClass">
            <el-table-column label="会议名称" width="360px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.conferenceName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年份" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.year }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上传人" width="300px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.user.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-tooltip
                  effect="dark"
                  content="详情"
                  placement="top"
                >
                  <el-button class="detailBtn" icon="el-icon-more" size="mini" @click="getDetail(row.id)" />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" @click="modifyProcess(row)" />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteWholeProcess(row.id)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            :current-page.sync="currentPage"
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
      :visible.sync="addProcessDialogVisible"
      width="30%"
      :before-close="clearBeforeClose"
    >
      <el-form ref="addProcessForm" :model="addProcessForm" :rules="rules" label-width="100px">
        <el-form-item prop="name" label="会议名称:">
          <el-col :span="12">
            <el-input v-model="addProcessForm.name" placeholder="请输入会议名称" style="width: 200px" />
          </el-col>
        </el-form-item>
        <el-form-item prop="year" label="会议年份:">
          <el-col :span="12">
            <el-date-picker
              v-model="addProcessForm.year"
              value-format="yyyy"
              type="year"
              placeholder="选择年份"
              style="width: 200px"
            />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddProcess">取 消</el-button>
        <el-button type="primary" @click="addNewProcess('addProcessForm')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProcessProperty, addProcessProperty, deleteProcessProperty } from '@/api/processProperty'
export default {
  name: 'ProjectProcess',
  data() {
    return {
      total: 0,
      currentPage: 1,
      processList: [],
      addProcessDialogVisible: false,
      currentOperation: '添加会议',
      file: null,
      addProcessForm: {
        id: null,
        conferenceName: '',
        year: 0,
        path: '',
        file: null
      },
      rules: {
        name: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
        year: [{ required: true, message: '请输入事件年份', trigger: 'blur' }],
        file: [
          {
            trigger: 'blur',
            validator: async(rule, value, callback) => {
              if (!this.file) callback(new Error('请上传预答辩论文文件'))
            }
          }
        ]
      }
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchProcess(this.currentPage)
  },
  methods: {
    // 分页获取会议
    fetchProcess(page) {
      // console.log(this.processList)
      return new Promise((resolve, reject) => {
        getProcessProperty(page, 10)
          .then(res => {
            this.processList = res.data.list
            this.total = res.data.total
            console.log(res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 上一页
    handlePrev(val) {
      this.fetchProcess(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 下一页
    handleNext(val) {
      this.fetchProcess(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchProcess(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    getDetail(id) {
      this.$router.push('/property/processDetail/' + id)
    },
    deleteWholeProcess(id) {
      deleteProcessProperty(id).then(() => {
        this.$message.success('删除成功')
        this.fetchProcess(this.currentPage)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    addNewProcess(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addProcessForm.path = '/Property/Process/' + this.addProcessForm.year + '/' + this.addProcessForm.name
          const formData = new FormData()
          formData.append('processPropertyJsonStr', JSON.stringify(this.addProcessForm))
          addProcessProperty(formData).then(() => {
            if (this.currentOperation === '添加会议') {
              this.$message.success('添加成功')
            } else if (this.currentOperation === '修改会议') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddProcess()
            this.fetchProcess(this.currentPage)
          }).catch(() => {
            if (this.currentOperation === '添加会议') {
              this.$message.error('添加失败')
            } else if (this.currentOperation === '修改会议') {
              this.$message.error('修改失败')
            } else {
              this.$message.error('未知的状态！')
            }
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
    modifyProcess(row) {
      this.currentOperation = '修改会议'
      this.addProcessForm.id = row.id
      this.addProcessForm.name = row.name
      this.addProcessForm.year = row.year
      this.addProcessDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addProcessForm = {
        id: null,
        name: '',
        year: 0,
        type: '',
        path: ''
      }
      return done(true)
    },
    cancelAddProcess() {
      this.addProcessDialogVisible = false
      this.addProcessForm = {
        id: null,
        name: '',
        year: 0,
        type: '',
        path: ''
      }
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding: 0 12px;
    background-color: #fafafa;
    border-radius: 0;
  }

  .processWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .processBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
  }

  @media only screen and (min-width: 1400px) {
    .processBox {
      max-width: 1305px !important;
    }
  }

  .processList {
    min-height: 500px;
  }

  .pagination {
    margin-top:16px;
    display:flex;
    justify-content:center;
  }

  .detailBtn {
    padding: 2px 6px;
    border-radius: 5px;
  }

  .modifyBtn {
    padding: 2px 6px;
    border-radius: 5px;
  }

  .deleteBtn {
    padding: 2px 6px;
    border-radius: 5px;
    margin-left: 16px;
  }
</style>
