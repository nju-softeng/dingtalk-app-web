<template>
  <div class="app-container">
    <div class="scheduleWrap">
      <div class="scheduleBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="currentOperation='添加日程'; addScheduleDialogVisible=true">新建日程
        </el-button>
        <div class="scheduleList">
          <el-table :data="scheduleList" fit highlight-current-row class="tableClass">
            <el-table-column label="日程名称" width="360px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年份" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.year }}</span>
              </template>
            </el-table-column>
            <el-table-column label="日程类型" width="300px" align="center">
              <template slot-scope="{ row }">
                <span>{{ typeConverter[row.type] }}</span>
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
                  <el-button class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" @click="modifySchedule(row)" />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteWholeSchedule(row.id)" />
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
      :visible.sync="addScheduleDialogVisible"
      width="30%"
      :before-close="clearBeforeClose"
    >
      <el-form ref="addScheduleForm" :model="addScheduleForm" :rules="rules" label-width="100px">
        <el-form-item prop="name" label="日程名称:">
          <el-col :span="12">
            <el-input v-model="addScheduleForm.name" placeholder="请输入日程名称" style="width: 200px" />
          </el-col>
        </el-form-item>
        <el-form-item prop="year" label="日程年份:">
          <el-col :span="12">
            <el-date-picker
              v-model="addScheduleForm.year"
              value-format="yyyy"
              type="year"
              placeholder="选择年份"
              style="width: 200px"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="type" label="日程类型:">
          <el-col :span="8">
            <el-select v-model="addScheduleForm.type" placeholder="请选择日程类型" style="width: 200px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddSchedule">取 消</el-button>
        <el-button type="primary" @click="addNewSchedule('addScheduleForm')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getScheduleList, addSchedule, deleteSchedule, addAbsentOA, deleteAbsentOA, getAbsentOADetail } from '@/api/schedule'
export default {
  name: 'Index',
  data() {
    return {
      total: 0,
      currentPage: 1,
      scheduleList: [],
      addScheduleDialogVisible: false,
      typeConverter: ['项目会议', '团队组织/参与的日程', '实验室日程'],
      currentOperation: '添加日程',
      addScheduleForm: {
        id: null,
        name: '',
        year: null,
        type: '',
        path: ''
      },
      rules: {
        name: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
        year: [{ required: true, message: '请输入事件年份', trigger: 'blur' }],
        type: [{ required: true, message: '请选择事件类型', trigger: 'blur' }]
      },
      options: [
        {
          value: '0',
          label: '项目会议'
        },
        {
          value: '1',
          label: '团队组织/参与的日程'
        },
        {
          value: '2',
          label: '实验室日程'
        }
      ]
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchSchedule(this.currentPage)
  },
  methods: {
    // 分页获取日程
    fetchSchedule(page) {
      console.log(page, 11111)
      return new Promise((resolve, reject) => {
        getScheduleList(page, 10)
          .then(res => {
            this.scheduleList = res.data.list
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
      this.fetchSchedule(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 下一页
    handleNext(val) {
      this.fetchSchedule(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchSchedule(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    getDetail(id) {
      this.$router.push('/property/scheduleDetail/' + id)
    },
    deleteWholeSchedule(id) {
      deleteSchedule(id).then(() => {
        this.$message.success('删除成功')
        this.fetchSchedule(this.currentPage)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    addNewSchedule(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addScheduleForm.path = 'Property/Schedule/' + this.addScheduleForm.year + '/' + this.addScheduleForm.name
          const formData = new FormData()
          formData.append('scheduleJsonStr', JSON.stringify(this.addScheduleForm))
          addSchedule(formData).then(() => {
            if (this.currentOperation === '添加日程') {
              this.$message.success('添加成功')
            } else if (this.currentOperation === '修改日程') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddSchedule()
            this.fetchSchedule(this.currentPage)
          }).catch(() => {
            if (this.currentOperation === '添加日程') {
              this.$message.error('添加失败')
            } else if (this.currentOperation === '修改日程') {
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
    modifySchedule(row) {
      this.currentOperation = '修改日程'
      this.addScheduleForm.id = row.id
      this.addScheduleForm.name = row.name
      this.addScheduleForm.year = row.year
      this.addScheduleForm.type = row.type
      this.addScheduleDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addScheduleForm = {
        id: null,
        name: '',
        year: null,
        type: '',
        path: ''
      }
      return done(true)
    },
    cancelAddSchedule() {
      this.addScheduleDialogVisible = false
      this.addScheduleForm = {
        id: null,
        name: '',
        year: null,
        type: '',
        path: ''
      }
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding: 12px;
    background-color: #fafafa;
    border-radius: 0;
  }

  .scheduleWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .scheduleBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
  }

  @media only screen and (min-width: 1400px) {
    .scheduleBox {
      max-width: 1305px !important;
    }
  }

  .scheduleList {
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
