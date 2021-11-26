<template>
  <div class="project">
    <!-- 项目列表 -->
    <div v-loading="loading" class="list">
      <!-- 无数据提示  -->
      <div v-if="list.length == 0" style="margin-left: auto;margin-right: auto; padding-top:100px">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
      <!-- 项目卡片 -->
      <el-card v-for="(item, index) in list" :key="index" class="item" shadow="never">
        <div>
          <!-- 标题 -->
          <div style="margin-bottom:17px; ">
            <router-link :to="'/project/detail/' + item.id" class="link-type">
              <svg-icon icon-class="git" style="font-size:16px; color:#586069; margin-right:5px" />
              <el-link :underline="false" type="primary">{{
                item.title
              }}</el-link>
              <el-tag v-if="item.cnt != 0" type="info" style="margin-left:10px;" effect="plain">第 {{ item.cnt }} 次迭代</el-tag>
            </router-link>
          </div>
        </div>
        <!-- 无迭代时提示信息 -->
        <template v-if="item.cnt == 0">
          <p style="color: #586069">尚未创建迭代</p>
          <p>
            <span style="padding-right:15px; color: #586069">项目创建者：{{ item.name }}</span>
          </p>
        </template>
        <!-- 项目迭代信息 -->
        <template v-else-if="!item.status">
          <p style="color: #586069">
            <span class="date" style="padding-right:15px;">
              <i class="el-icon-time" /> : {{ item.begin_time }} ~
              {{ item.end_time }}</span>
            <span v-if="getRemainDay(item.end_time) >= 0" style="color:#67C23A">
              剩余:
              {{ getRemainDay(item.end_time) }} 天</span>
            <span v-else style="color:#F56C6C">
              延期: {{ -getRemainDay(item.end_time) }} 天</span>
          </p>
          <div style="font-size:12px;line-height:28px;">
            <span style="padding-right:15px;color: #586069 ">项目创建者：{{ item.name }}</span>
            <span style="padding-right:15px; color:#bfbfbf;">预期AC：{{ item.expectedac }}</span>
            <!-- <span>按时交付: {{ item.success_cnt }} 次</span> -->

            <el-button style="float:right" size="mini" @click="commitBug(item.id)">报告bug</el-button>
          </div>
        </template>
        <template v-else>
          <p style="color: #586069">
            <span class="date" style="padding-right:15px;">
              <i class="el-icon-time" /> : {{ item.begin_time }} ~
              {{ item.end_time }}</span>
            <span v-if="compareTime(item.end_time, item.finish_time)" style="color:#67C23A">
              按时完成
            </span>
            <span v-else style="color:#F56C6C"> 延期完成</span>
          </p>
          <div style="font-size:12px;line-height:28px;">
            <span style=" color: #586069">项目创建者：{{ item.name }}</span>

            <span style="padding-left:15px; color:#bfbfbf;">
              <router-link :to="'/project/detail/' + item.id" class="link-type">
                查看详情
              </router-link>
            </span>

            <el-button style="float:right" size="mini" @click="commitBug(item.id)">报告bug</el-button>
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>
<script>
import { listAllProject } from '@/api/project.js'

export default {
  data() {
    return {
      radio: '',
      finishtime: '',
      userlist: [],
      unfinish: true,
      dialog: false,
      list: [],
      loading: false,
      dcloading: false,
      uid: '',
      detailDialog: false,
      projectAc: {},
      tmp: {
        name: '',
        dates: ['', '']
      },
      dclist: []
    }
  },
  computed: {
    getRemainDay() {
      return endtime => {
        const day =
          (new Date(endtime) - new Date().setHours(8, 0, 0, 0)) /
          (24 * 3600 * 1000)
        return day
      }
    }
  },
  created() {
    this.uid = sessionStorage.getItem('uid')
    listAllProject().then(res => {
      this.list = res.data
      console.log(this.list)
    })
  },
  methods: {
    compareTime(ddl, finish) {
      const d1 = new Date(ddl)
      const d2 = new Date(finish)
      return d1.getTime() > d2.getTime()
    },
    commitBug(id) {
      this.$router.push({
        name: 'Detail',
        params: {
          id: id,
          tab: 'bug'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.project ::v-deep .el-dialog__body {
  padding-top: 5px;
}

.project ::v-deep .el-card__body {
  padding: 15px;
}

p {
  font-size: 12.5px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 750px;
}

.item {
  margin: 5px 5px 5px 0;
  height: 120px;
  width: 49%;
}
</style>
