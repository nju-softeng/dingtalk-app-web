<template>
  <div class="project">
    <!-- 添加button  -->
    <div class="action" style="margin-bottom:10px">
      <el-button type="primary" icon="el-icon-plus" @click="projectDialog = true">创建项目</el-button>
      <!-- <el-select style="width:100px;float:right;margin-right:10px">
        <el-option label="进行中" value="true"> </el-option>
        <el-option label="已结束" value="false"> </el-option>
      </el-select> -->
    </div>

    <!-- 项目列表 -->
    <div v-loading="loading" class="list">
      <!-- 无数据提示  -->
      <div v-if="list.length === 0" style="margin-left: auto;margin-right: auto; padding-top:100px">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
      <!-- 项目卡片 -->
      <el-card v-for="(item, index) in list" :key="index" class="item" shadow="never">
        <div>
          <!-- 下拉菜单 -->
          <div style="float:right">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more " />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" @click.native="modifyProject(item)">修改项目</el-dropdown-item>
                <el-dropdown-item icon="el-icon-error" @click.native="rmProject(item)">删除项目</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 标题 -->
          <div style="margin-bottom:17px">
            <svg-icon icon-class="git" style="font-size:16px; color:#586069" />
            <router-link :to="'/project/detail/' + item.id" class="link-type">
              <a> {{ item.title }}</a>
              <el-tag v-if="item.cnt != 0" type="info" style="margin-left:10px;" effect="plain">第 {{ item.cnt }} 次迭代</el-tag>
            </router-link>
          </div>
        </div>
        <!-- 无迭代时提示信息 -->
        <template v-if="item.cnt === 0">
          <p style="font-size:12.5px;color: #586069">请新建迭代</p>
          <el-button v-if="item.cnt === 0" style="float:right" size="mini" @click="newIterate(item)">新建迭代</el-button>
        </template>
        <!-- 项目迭代信息 -->
        <template v-else-if="!item.status">
          <p style="color: #586069">
            <span class="date" style="padding-right:15px;"> <i class="el-icon-time" /> : {{ item.begin_time }} ~ {{ item.end_time }}</span>
            <span v-if="getRemainDay(item.end_time) >= 0" style="color:#67C23A">
              剩余:
              {{ getRemainDay(item.end_time) }} 天</span>
            <span v-else style="color:#F56C6C"> 延期: {{ -getRemainDay(item.end_time) }} 天</span>
          </p>
          <div style="font-size:12px;color:#bfbfbf;line-height:28px;">
            <span style="padding-right:15px; ">预期AC：{{ item.expectedac }}</span>
            <!-- <span>按时交付: {{ item.success_cnt }} 次</span> -->

            <el-button style="float:right" size="mini" @click="finishIterate(item)">确认完成</el-button>
          </div>
        </template>
        <template v-else>
          <p style="color: #586069">
            <span class="date" style="padding-right:15px;"> <i class="el-icon-time" /> : {{ item.begin_time }} ~ {{ item.end_time }}</span>
            <span v-if="compareTime(item.end_time, item.finish_time)" style="color:#67C23A">
              按时完成
            </span>
            <span v-else style="color:#F56C6C"> 延期完成</span>
          </p>
          <div style="font-size:12px;color:#bfbfbf;line-height:28px;">
            <span style="padding-right:15px; color:#bfbfbf;">
              <router-link :to="'/project/detail/' + item.id" class="link-type">
                查看详情
              </router-link>
            </span>

            <el-button style="float:right" size="mini" @click="newIterate(item)">新建迭代</el-button>
          </div>
        </template>
      </el-card>
    </div>

    <!-- 创建项目dialog -->
    <el-dialog title="项目" :lock-scroll="false" :visible.sync="projectDialog" width="32%" @submit.native.prevent @close="clearProjectForm">
      <el-form ref="projectForm" v-loading="loading" style="width:100%" label-width="100px" :rules="rules" :model="projectForm">
        <el-form-item prop="name" label="项目名称：">
          <el-input v-model="projectForm.name" style="!important" />
        </el-form-item>
        <el-form-item prop="leader" label="项目负责人：">
          <el-select
            v-model="projectForm.leaderId"
            style="width:193px"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-tooltip
                  class="item"
                  effect="dark"
                  content="支持搜索功能快速查找用户"
                  placement="right"
          >
                    <span style="margin-left:8px">
                      <svg-icon icon-class="hint" /></span>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="nature" label="项目性质：">
          <el-select v-model="projectForm.nature" placeholder="请选择">
            <el-option
              v-for="item in projectNatureList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="level" label="项目级别：">
          <el-select v-if="projectForm.nature" v-model="projectForm.horizontalLevel" placeholder="请选择">
            <el-option
              v-for="item in projectHorizontalLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="!projectForm.nature" v-model="projectForm.longitudinalLevel" placeholder="请选择">
            <el-option
              v-for="item in projectLongitudinalLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width:100%" @click="submitProject">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加迭代dialog -->
    <iterate-dialog :pid="pid" :title="title" :cnt="cnt" :show.sync="iteationDialog" @submitted="handleSubmit" />
    <!-- 完成迭代dialog -->
    <finish-drawer :iterate="tmp" :show.sync="bdrawer_show" :title="title" :serial="serial" @submitted="handleSubmit" />
  </div>
</template>
<script>
import { getUserList } from '@/api/common'
import { createProject, listProject, rmProject, getIteration } from '@/api/project.js'
import FinishDrawer from './finishDrawer'
import IterateDialog from './iterateDialog'
const projectNature = [
  { label: '横向项目', value: true },
  { label: '纵向项目', value: false }
]
const projectLongitudinalLevel = [
  { label: '国家级项目', value: '国家级项目' },
  { label: '省部级项目', value: '省部级项目' },
  { label: '厅局级项目', value: '厅局级项目' },
  { label: '国家级学会和协会项目', value: '国家级学会和协会项目' },
  { label: '省级学会和协会项目', value: '省级学会和协会项目' }
]
const projectHorizontalLevel = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' }
]
export default {
  components: { IterateDialog, FinishDrawer },
  data() {
    return {
      bdrawer_show: false,
      iteationDialog: false,
      projectDialog: false,
      pid: '',
      title: '',
      cnt: '',
      list: [],
      userList: [],
      serial: 0,
      loading: false,
      projectNatureList: projectNature,
      projectLongitudinalLevelList: projectLongitudinalLevel,
      projectHorizontalLevelList: projectHorizontalLevel,
      projectForm: {
        id: '',
        name: '',
        leaderId: '',
        nature: '',
        longitudinalLevel: '',
        horizontalLevel: ''
      },
      tmp: {},
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        dates: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        dingIds: [{ required: true, message: '请分配任务', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getRemainDay() {
      return endtime => {
        const day = (new Date(endtime) - new Date().setHours(8, 0, 0, 0)) / (24 * 3600 * 1000)
        return day
      }
    }
  },
  created() {
    this.fetchProjects()
    getUserList().then(res => {
      this.userList = res.data
    })
  },

  methods: {
    compareTime(ddl, finish) {
      const d1 = new Date(ddl)
      const d2 = new Date(finish)
      return d1.getTime() > d2.getTime()
    },
    // 更新数据
    fetchProjects() {
      listProject().then(res => {
        this.list = res.data
        console.log(this.list)
      })
    },
    // 创建或更新项目
    submitProject() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.projectForm)
          createProject(this.projectForm)
            .then(() => {
              this.projectDialog = false
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
              listProject().then(res => {
                this.list = res.data
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$notify({
            title: '提交失败',
            message: '请填写项目名称',
            type: 'warning'
          })
        }
      })
    },
    // 修改项目
    modifyProject(item) {
      this.projectDialog = true
      this.$nextTick(() => {
        this.projectForm.id = item.id
        this.projectForm.title = item.title
      })
    },
    // 删除项目
    rmProject(item) {
      console.log('/????')
      if (item.cnt !== 0) {
        this.$message({
          showClose: true,
          message: '请删除项目的迭代之后，再删除项目',
          type: 'warning'
        })
      } else {
        rmProject(item.id).then(() => {
          listProject().then(res => {
            this.list = res.data
          })
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
      }
    },
    // 清空dialog
    clearProjectForm() {
      this.$refs.projectForm.resetFields()
      this.projectForm.id = ''
    },
    // 新建一个迭代
    newIterate(item) {
      this.title = item.title
      this.pid = item.id
      this.cnt = item.cnt
      this.iteationDialog = true
    },
    handleSubmit() {
      this.fetchProjects()
    },
    finishIterate(item) {
      console.log(item)
      getIteration(item.itid).then(res => {
        console.log(res.data)
        this.tmp = res.data
        this.title = item.title
        this.serial = item.cnt
        this.bdrawer_show = true
      })
    }
  },
  watch: {
    'projectForm.nature': function(newValue, oldValue) {
      this.projectForm.horizontalLevel = null
      this.projectForm.longitudinalLevel = null
    }
  }
}
</script>
<style lang="scss" scoped>
.project ::v-deep .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 0px;
}
.project ::v-deep .el-dialog__title {
  font-size: 14px;
}
.list ::v-deep .el-card__body {
  padding-right: 15px;
}

a {
  font-size: 14px;
  color: #0366d6;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 750px;
}

.item {
  margin: 5px 5px 5px 0;
  height: 125px;
  width: 49%;
  background-color: #fff;
  border-radius: 3px;
}

p {
  font-size: 12.5px;
}
</style>
