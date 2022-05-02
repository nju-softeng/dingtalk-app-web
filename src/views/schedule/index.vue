<template>
  <div class="app-container">
    <div class="scheduleWrap">
      <div class="scheduleBox">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px;"
          @click="currentOperation='新建日程'; addScheduleDialogVisible=true"
        >新建日程
        </el-button>
        <div class="scheduleList">
          <el-table :data="scheduleList" fit highlight-current-row class="tableClass">
            <el-table-column label="日程名称" width="360px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.summary }}</span>
              </template>
            </el-table-column>
            <el-table-column label="日程时间" width="200px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.start | dateFormat("yyyy年") }} → {{ row.end }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地点" width="200px" align="center">
              <template slot-scope="{ row }">
                <span v-if="row.online"><el-tag>线上</el-tag></span>
                <span v-else>{{ row.location }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100px" align="center">
              <template slot-scope="{ row }">
                <div v-if="row.acCalculated">
                  <el-tag type="info">
                    已结算
                  </el-tag>
                </div>
                <div v-else-if="nowTime.getTime() > row.end.getTime()">
                  {{ nowTime.getTime() }}
                  {{ row.end.getTime() }}
                  <el-tag type="info">
                    已结束
                  </el-tag>
                </div>
                <div v-else-if="nowTime.getTime() < row.start.getTime()">
                  {{ nowTime.getTime() }}
                  <el-tag type="success">
                    未开始
                  </el-tag>
                </div>
                <div v-else>
                  {{ nowTime.getTime() }}
                  <el-tag>
                    进行中
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-tooltip
                  effect="dark"
                  content="请假详情"
                  placement="top"
                >
                  <el-button class="detailBtn" icon="el-icon-more" size="mini" @click="absentDetailVisible = true" />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <el-button
                    class="modifyBtn"
                    type="primary"
                    icon="el-icon-s-operation"
                    size="mini"
                    @click="modifySchedule(row)"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    class="deleteBtn"
                    type="danger"
                    icon="el-icon-delete-solid"
                    size="mini"
                    @click="deleteWholeSchedule(row.id)"
                  />
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
        <el-form-item prop="summary" label="日程名称:">
          <el-col :span="16">
            <el-input v-model="addScheduleForm.summary" placeholder="请输入日程名称" style="width: 200px" />
          </el-col>
        </el-form-item>
        <el-form-item prop="time" label="日程时间:">
          <el-col :span="16">
            <el-date-picker
              v-model="addScheduleForm.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 200px"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="location" label="日程地点:">
          <el-row>
            <el-col :span="16">
              <el-input
                v-model="addScheduleForm.location"
                placeholder="请输入日程地点"
                :disabled="addScheduleForm.online"
                style="width: 200px"
              />
            </el-col>
            <el-col :span="4">
              <el-checkbox v-model="addScheduleForm.online">线上</el-checkbox>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="attendessIdList" label="与会人员">
          <el-row>
            <el-col :span="16">
              <el-cascader
                v-model="addScheduleForm.attendeesIdList"
                style="width: 200px"
                filterable
                multiple
                collapse-tags
                placeholder="请选择与会人员"
                :options="userList"
                :props="{ multiple: true}"
              />
            </el-col>
            <el-col :span="4">
              <el-tooltip
                class="item"
                effect="dark"
                content="支持搜索功能快速查找用户"
                placement="right"
              >
                <span style="margin-left: 8px">
                  <svg-icon
                    icon-class="hint"
                  /></span>
              </el-tooltip>
            </el-col>
          </el-row>
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
import { getUserList } from '@/api/common'
import {
  getScheduleList,
  addSchedule,
  deleteSchedule,
  addAbsentOA,
  deleteAbsentOA,
  getAbsentOADetail
} from '@/api/schedule'

export default {
  name: 'Index',
  data() {
    return {
      nowTime: 0,
      total: 0,
      currentPage: 1,
      scheduleList: [],
      addScheduleDialogVisible: false,
      absentDetailVisible: false,
      currentOperation: '新建日程',
      userList: [],
      addScheduleForm: {
        id: null,
        summary: '',
        time: null,
        start: null,
        end: null,
        online: false,
        location: '',
        attendeesIdList: []
      },
      rules: {
        summary: [{ required: true, message: '请输入日程名称', trigger: 'blur' }],
        time: [{ required: true, message: '请选择日程时间', trigger: 'blur' }],
        location: [{
          trigger: 'blur',
          validator: async(rule, value, callback) => {
            if (!this.addScheduleForm.online) {
              callback(new Error('请输入日程地点'))
            }
          }
        }]
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
    this.nowTime = new Date()
    getUserList().then((res) => {
      const tempUserList = []
      for (const i in res.data) {
        tempUserList.push({
          value: res.data[i].id,
          label: res.data[i].name
        })
      }
      this.userList = [{
        label: '第一组',
        value: 1,
        children: tempUserList
      }]
      console.log(this.userList)
    }).catch(err => {
      this.$message.error('无法获取用户列表！')
      console.log(err)
    })
    this.fetchSchedule(this.currentPage)
  },
  methods: {
    // 分页获取日程
    fetchSchedule(page) {
      return new Promise((resolve, reject) => {
        getScheduleList(page, 10).then(res => {
          this.scheduleList = res.data.list
          for (const i in this.scheduleList) {
            this.scheduleList[i].attendeesIdList = []
            for (const j in this.scheduleList[i].dingTalkScheduleDetailList) {
              this.scheduleList[i].attendeesIdList.push([1, this.scheduleList[i].dingTalkScheduleDetailList[j].user.id])
            }
            this.scheduleList[i].start = new Date(Date.parse(this.scheduleList[i].start))
            this.scheduleList[i].end = new Date(Date.parse(this.scheduleList[i].end))
            this.scheduleList[i].time = [this.scheduleList[i].start, this.scheduleList[i].end]
          }
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
          for (const i in this.addScheduleForm.attendeesIdList) {
            this.addScheduleForm.attendeesIdList[i] = this.addScheduleForm.attendeesIdList[i][1]
          }
          this.addScheduleForm.start = this.addScheduleForm.time[0]
          this.addScheduleForm.end = this.addScheduleForm.time[1]
          // console.log(this.addScheduleForm)
          addSchedule(this.addScheduleForm).then(() => {
            if (this.currentOperation === '新建日程') {
              this.$message.success('添加成功')
            } else if (this.currentOperation === '修改日程') {
              this.$message.success('修改成功')
            } else {
              this.$message.error('未知的状态！')
            }
            this.cancelAddSchedule()
            this.fetchSchedule(this.currentPage)
          }).catch(() => {
            if (this.currentOperation === '新建日程') {
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
      console.log(row)
      console.log(this.scheduleList)
      this.currentOperation = '修改日程'
      this.addScheduleForm.id = row.id
      this.addScheduleForm.summary = row.summary
      this.addScheduleForm.start = row.start
      this.addScheduleForm.end = row.end
      this.addScheduleForm.time = row.time
      this.addScheduleForm.online = row.online
      this.addScheduleForm.location = row.location
      this.addScheduleForm.attendeesIdList = row.attendeesIdList
      this.addScheduleDialogVisible = true
    },
    clearBeforeClose(done) {
      this.addScheduleForm = {
        id: null,
        summary: '',
        start: null,
        end: null,
        time: null,
        online: false,
        location: '',
        attendeesIdList: []
      }
      return done(true)
    },
    cancelAddSchedule() {
      this.addScheduleDialogVisible = false
      this.addScheduleForm = {
        id: null,
        summary: '',
        start: null,
        end: null,
        time: null,
        online: false,
        location: '',
        attendeesIdList: []
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
    margin-top: 16px;
    display: flex;
    justify-content: center;
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
