<template>
  <div class="app-container">
    <div class="processWrap">
      <div class="processBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="currentOperation='添加会议'; addProcessDialogVisible=true">新建会议记录
        </el-button>
        <div class="processList">
          <el-table :data="processList" fit highlight-current-row class="tableClass">
            <el-table-column label="会议名称" width="460px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.conferenceName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年份" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.year }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上传人" width="200px" align="center">
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
                  v-show="row.user.id === uid"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" @click="modifyProcess(row)" />
                </el-tooltip>
                <el-button v-show="row.user.id !== uid" class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" disabled />
                <el-tooltip
                  v-show="row.user.id === uid"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteWholeProcess(row.id)" />
                </el-tooltip>
                <el-button v-show="row.user.id !== uid" class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" disabled />
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
      :before-close="clearBeforeClose"
    >
      <div>
        <el-form ref="addProcessForm" :model="addProcessForm" :rules="rules" style="">
          <el-form-item prop="conferenceName" label="会议名称:">
              <el-input v-model="addProcessForm.conferenceName" placeholder="请输入会议名称"/>
          </el-form-item>
          <el-form-item prop="year" label="会议年份:">
              <el-date-picker
                v-model="addProcessForm.year"
                value-format="yyyy"
                format="yyyy 年"
                type="year"
                placeholder="选择年份"
                style="width: fit-content;"
              />
          </el-form-item>
          <process-ppt-upload v-show="currentOperation === '添加会议'" ref="child" :file="file" @changeFile="changeFile" />
        </el-form>
        <span slot="footer">
          <el-button @click="cancelAddProcess">取 消</el-button>
          <el-button type="primary" @click="addNewProcess('addProcessForm')">确 认</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProcessPptUpload from './processPptUpload'
import { getProcessProperty, addProcessProperty, deleteProcessProperty } from '@/api/processProperty'
export default {
  name: 'ProjectProcess',
  components: { ProcessPptUpload },
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
        year: null,
        filePath: '',
        file: null
      },
      rules: {
        conferenceName: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
        year: [{ required: true, message: '请输入事件年份', trigger: 'blur' }]
      },
      uid: -1
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchProcess(this.currentPage)
    this.uid = parseInt(sessionStorage.getItem('uid'))
  },
  methods: {
    // 分页获取会议
    fetchProcess(page) {
      console.log(this.processList)
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
      this.$router.push('/property/academic/process-detail/' + id)
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
          this.addProcessForm.filePath = 'Property/Academic/Process/' + this.addProcessForm.conferenceName + '/' + this.addProcessForm.year + '/' + sessionStorage.getItem('name')
          const formData = new FormData()
          if (this.file != null) {
            formData.append('file', this.file.raw)
          } else {
            formData.append('file', null)
          }
          formData.append('processPropertyVOJsonStr', JSON.stringify(this.addProcessForm))
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
      this.addProcessForm.conferenceName = row.conferenceName
      this.addProcessForm.year = row.year
      this.addProcessDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addProcessForm = {
        id: null,
        conferenceName: '',
        year: 0,
        filePath: ''
      }
      this.$refs.child.handleClose()
      return done(true)
    },
    cancelAddProcess() {
      this.addProcessDialogVisible = false
      this.addProcessForm = {
        id: null,
        conferenceName: '',
        year: 0,
        filePath: ''
      }
      this.$refs.child.handleClose()
    },
    changeFile(file) {
      this.file = file
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
    margin-left: 16px;
  }

  .deleteBtn {
    padding: 2px 6px;
    border-radius: 5px;
    margin-left: 16px;
  }
</style>
