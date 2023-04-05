<template>
  <div class="app-container">
    <div class="eventWrap">
      <div class="eventBox">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="currentOperation='添加活动'; addEventDialogVisible=true">新建活动
        </el-button>
        <div class="eventList">
          <el-table :data="eventList" fit highlight-current-row class="tableClass">
            <el-table-column label="活动/会议名称" width="360px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年份" width="150px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.year }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动类型" width="300px" align="center">
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
                  <el-button class="modifyBtn" type="primary" icon="el-icon-s-operation" size="mini" @click="modifyEvent(row)" />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteWholeEvent(row.id)" />
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
      :visible.sync="addEventDialogVisible"
      width="400px"
      :before-close="clearBeforeClose"
    >
      <el-form ref="addEventForm" :model="addEventForm" :rules="rules">
        <el-form-item prop="name" label="活动名称:">
            <el-input v-model="addEventForm.name" placeholder="请输入活动名称"/>
        </el-form-item>
        <el-form-item prop="year" label="活动年份:">
            <el-date-picker
              v-model="addEventForm.year"
              value-format="yyyy"
              type="year"
              placeholder="选择年份"
              style="width: inherit"
            />
        </el-form-item>
        <el-form-item prop="type" label="活动类型:">
            <el-select v-model="addEventForm.type" placeholder="请选择活动类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddEvent">取 消</el-button>
        <el-button type="primary" @click="addNewEvent('addEventForm')">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listEvent, addEvent, deleteEvent } from '@/api/eventProperty'

export default {
  name: 'EventProperty',
  data() {
    return {
      total: 0,
      currentPage: 1,
      eventList: [],
      addEventDialogVisible: false,
      typeConverter: ['项目会议', '团队组织/参与的活动', '实验室活动'],
      currentOperation: '添加活动',
      addEventForm: {
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
          label: '团队组织/参与的活动'
        },
        {
          value: '2',
          label: '实验室活动'
        }
      ]
    }
  },
  created() {
    this.currentPage = parseInt(sessionStorage.getItem('inner-cur-page')) || 1
    this.fetchEvent(this.currentPage)
  },
  methods: {
    // 分页获取活动
    fetchEvent(page) {
      // console.log(this.eventList)
      return new Promise((resolve, reject) => {
        listEvent(page, 10)
          .then(res => {
            this.eventList = res.data.list
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
      this.fetchEvent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 下一页
    handleNext(val) {
      this.fetchEvent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchEvent(val)
      sessionStorage.setItem('inner-cur-page', val)
    },
    getDetail(id) {
      this.$router.push('/property/eventDetail/' + id)
    },
    deleteWholeEvent(id) {
      deleteEvent(id).then(() => {
        this.$message.success('删除成功')
        this.fetchEvent(this.currentPage)
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    addNewEvent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addEventForm.path = 'Property/Event/' + this.addEventForm.year + '/' + this.addEventForm.name
          const formData = new FormData()
          formData.append('eventPropertyJsonStr', JSON.stringify(this.addEventForm))
          addEvent(formData).then(() => {
            if (this.currentOperation === '添加活动') {
              this.$message.success('添加成功')
            } else if (this.currentOperation === '修改活动') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddEvent()
            this.fetchEvent(this.currentPage)
          }).catch(() => {
            if (this.currentOperation === '添加活动') {
              this.$message.error('添加失败')
            } else if (this.currentOperation === '修改活动') {
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
    modifyEvent(row) {
      this.currentOperation = '修改活动'
      this.addEventForm.id = row.id
      this.addEventForm.name = row.name
      this.addEventForm.year = row.year
      this.addEventForm.type = row.type
      this.addEventDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addEventForm = {
        id: null,
        name: '',
        year: null,
        type: '',
        path: ''
      }
      return done(true)
    },
    cancelAddEvent() {
      this.addEventDialogVisible = false
      this.addEventForm = {
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

  .eventWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .eventBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
  }

  @media only screen and (min-width: 1400px) {
    .eventBox {
      max-width: 1305px !important;
    }
  }

  .eventList {
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
