<template>
  <div>
    <div class="headboard">
      <div class="wrap">
        <el-row>
          <el-col :xs="24" :sm="14" :lg="14">
            <div class="hello">
              <div>
                <el-avatar :icon="avatar" :src="avatar">{{ name }}</el-avatar>
              </div>
              <div class="hello-text">
                {{ helloTime }}{{ name }}，祝你开心每一天！<br>
                <div class="day-text hiden-xs">
                  『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》
                  <a @click="getYiYan">
                    <el-button type="text" icon="el-icon-refresh" />
                  </a>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="10" :lg="10">
            <div class="info">
              <div class="h-card">
                <div class="title">本月DC</div>
                <div>
                  <el-popover placement="right-start" width="400" trigger="hover">
                    <div class="popover">
                      <div class="item">
                        <div>第一周</div>
                        <div class="dc">{{ perf.w1 }}</div>
                      </div>
                      <div class="item">
                        <div>第二周</div>
                        <div class="dc">{{ perf.w2 }}</div>
                      </div>
                      <div class="item">
                        <div>第三周</div>
                        <div class="dc">{{ perf.w3 }}</div>
                      </div>
                      <div class="item">
                        <div>第四周</div>
                        <div class="dc">{{ perf.w4 }}</div>
                      </div>
                      <div class="item">
                        <div>第五周</div>
                        <div class="dc">{{ perf.w5 }}</div>
                      </div>
                    </div>
                    <div slot="reference" class="content">
                      {{ perf.dcTotal }}
                    </div>
                  </el-popover>
                </div>
              </div>

              <div class="h-card" @click="goAc">
                <div class="title">累计AC</div>
                <div class="content">
                  {{ perf.acTotal }}
                </div>
              </div>
              <div class="h-card" @click="goAuditor">
                <div class="title">待审申请</div>
                <div class="content">
                  {{ unCheckCnt }}
                </div>
              </div>
              <div class="h-card" @click="goBug">
                <div class="title" style="">待审bug</div>
                <div class="content">{{ bugCnt }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-menu class="auto" default-active="1" mode="horizontal">
          <el-menu-item index="1">消息</el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="dashboard-container">
      <div class="wrap">
        <el-row :gutter="6">
          <el-col :xs="24" :sm="16" :lg="16">
            <!-- 快捷导航 -->
            <el-card class="box-card" shadow="never" style="margin-bottom: 5px; ">
              <div class="shortcut">
                <div class="item hiden-s">
                  <div style="padding: 5px 0; font-size: 14px">快捷导航 >> </div>
                </div>
                <div class="item">
                  <router-link to="/performance/perfAudit">
                    <el-button plain class="btn">绩效审核</el-button>
                  </router-link>
                </div>
                <div class="item">
                  <router-link to="/performance/performance_dc">
                    <el-button plain class="btn">绩效汇总</el-button>
                  </router-link>
                </div>
                <div class="item">
                  <router-link to="/performance/performance_ac">
                    <el-button plain class="btn">AC汇总</el-button>
                  </router-link>
                </div>
                <div class="item">
                  <router-link to="/project/index">
                    <el-button plain class="btn">迭代管理</el-button>
                  </router-link>
                </div>

                <div class="item">
                  <router-link to="/paper/index/in-detail">
                    <el-button plain class="btn">论文管理</el-button>
                  </router-link>
                </div>
              </div>
            </el-card>
            <!-- 消息面板 -->
            <el-card class="box-card" shadow="never">
              <!-- 消息卡片头 -->
              <div slot="header" class="clearfix">
                <span>动态</span>
                <router-link :to="{ path: '/profile/index', query: { tab: 'msg' } }">
                  <el-button style="float: right;padding:0" type="text">查看更多</el-button>
                </router-link>
              </div>
              <!-- 消息内容 -->
              <div v-if="messages.length != 0" style="min-height:200px;font-size:14px;">
                <div v-for="(msg, index) in messages" :key="index" class="message">
                  <div class="title">{{ msg.title }}</div>
                  <div style="display:flex;justify-content:space-between;">
                    <div class="detail">
                      <span>{{ msg.content }}</span>
                    </div>
                    <div class="time">
                      <span>{{ new Date(msg.createTime) | timeAgo }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <template v-else>
                <div style="height:200px;text-align:center;padding-top:50px;">
                  <svg-icon icon-class="null" style="font-size:32px" />
                </div>
              </template>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8" :lg="8">

            <!-- AC排行 -->
            <el-card class="box-card" shadow="never" style="margin-bottom: 5px;">
              <el-table ref="table" class="table" height="83vh" :data="aclist" max-height="250" highlight-current-row style="width: 100%">
                <el-table-column type="index" label="AC排行" width="90" align="center" />
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="total" label="总AC" />
              </el-table>
            </el-card>

            <!-- AC变动公告 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>AC变动公告</span>
                <router-link to="/performance/performance_ac">
                  <el-button style="float: right; padding:0" type="text">查看详情</el-button>
                </router-link>
              </div>
              <el-carousel indicator-position="none" trigger="click" height="166px">
                <el-carousel-item v-for="(item, index) in lastAcs" :key="index">
                  <div class="ac-card">
                    <div class="ac-head">
                      <el-avatar :size="35">{{ item.username }}</el-avatar>
                      <div class="title">
                        <span>{{ item.username }} AC值</span>
                        <span v-if="item.ac > 0"> + </span>
                        <span>{{ item.ac }}</span>
                      </div>
                    </div>
                    <div class="reason" style="font-size:12.5px">
                      <span>变更原因：{{ item.reason }}</span>
                    </div>
                    <div v-if="item.auditorname != undefined" class="auditor" style="font-size:12.5px">
                      <span>审核人: {{ item.auditorname }}</span>
                    </div>
                    <div style="padding-top:15px;font-size:12.5px">
                      时间: {{ item.create_time }}
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </el-card>

          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessages } from '@/api/message'
import { lastAc, getPerformance } from '@/api/performance'
import { getUnCheckCnt } from '@/api/audit'
import { getAuditorBugCnt } from '@/api/bug'
import { showHelloTime } from '@/utils/index'
import { getYiYan } from '@/api/common'
import { getAcSummary } from '@/api/performance'

export default {
  data() {
    return {
      messages: [],
      lastAcs: [],
      aclist: [],
      unCheckCnt: 0,
      perf: {
        dcTotal: '',
        acTotal: '',
        w1: '',
        w2: '',
        w3: '',
        w4: '',
        w5: ''
      },
      name: '',
      avatar: null,
      count: 0,
      bugCnt: 0,
      yiyan: {}
    }
  },
  computed: {
    helloTime() {
      return showHelloTime()
    }
  },
  created() {
    this.avatar = sessionStorage.getItem('avatar')
    this.name = sessionStorage.getItem('name')
    this.getYiYan()
    // 消息
    getMessages(0, 5).then(res => {
      this.messages = res.data.content
    })
    // 实验室最近AC变更
    lastAc().then(res => {
      this.lastAcs = res.data
    })
    // 绩效
    getPerformance().then(res => {
      this.perf = res.data
    })
    // 审核人未审核数
    getUnCheckCnt().then(res => {
      this.unCheckCnt = res.data
    })
    // 查询待审核bug
    getAuditorBugCnt().then(res => {
      this.bugCnt = res.data
    })
    // 获取ac排名
    getAcSummary().then(res => {
      this.aclist = res.data
    })
  },
  methods: {
    getYiYan() {
      getYiYan().then(res => {
        this.yiyan = res.data
      })
    },

    goAuditor() {
      this.$router.push({ path: '/performance/perfAudit' })
    },
    goAc() {
      this.$router.push({
        path: '/profile/index',
        query: {
          tab: 'actab'
        }
      })
    },
    goBug() {
      this.$router.push({
        path: '/project/index',
        query: {
          tab: 'userbug'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headboard {
  padding: 0 20px;
  width: 100%;
  min-height: 120px;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
  position: relative;

  .hello {
    display: flex;
    align-items: center;
    height: 90px;
    padding-left: 20px;
    .hello-text {
      padding-top: 16px;
      margin-left: 16px;
      font-size: 16px;
      color: #333;
      .day-text {
        padding-top: 8px;
        font-size: 10px;
        color: #8c8c8c;
      }
    }
  }

  .info {
    display: flex;
    justify-content: flex-end;
    .h-card {
      padding: 20px 5px;
      width: 100px;
      cursor: pointer;
      .title {
        text-align: center;
        padding: 6px 0px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }
      .content {
        font-size: 24px;
        text-align: center;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }

  /deep/ .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
}

@media only screen and (max-width: 767px) {
  .auto {
    border-top: 1px solid #e8e8e8;
  }
  .hiden-xs {
    display: none !important;
  }
  .hello-text {
    padding-top: 0px !important;
  }

}

@media only screen and (max-width: 940px) {
  .hiden-s {
    display: none !important;
  }
}

@media only screen and (min-width: 768px) {
  .auto {
    position: absolute;
    bottom: 0;
  }

}

@media only screen and (min-width: 1200px) and (max-width:1400px) {
  .wrap {
    max-width: 96%;
  }
}
@media only screen and (min-width: 1401px) {
  .wrap {
    max-width: 1305px;
  }
}

.popover {
  display: flex;
  .item {
    padding: 0px 15px 5px;
    font-size: 12px;
  }
  .dc {
    text-align: center;
  }
}

.dashboard-container {
  padding: 12px;
  background-color: #fafafa;

  /deep/ .el-card__body {
    padding: 5px 20px 5px;
    font-size: 14px;
  }
}

.wrap {
  //max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.shortcut {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .item {
    padding-top: 4px;
    padding-bottom: 5px;
    padding-right: 15px;
  }
  .btn {
    width: 90px;
  }
}

.message {
  height: 72px;
  padding-top: 7px;
  padding-bottom: 10px;
  font-size: 14px;
  border-bottom: 0.5px solid #d2d6de;
  margin-bottom: 4px;
  .title {
    color: #1890ff;
    line-height: 24px;
    height: 24px;
    font-size: 14px;
    display: inline-block;
  }
  .detail {
    font-size: 12px;
    padding-top: 6px;
    white-space: pre;
  }
  .time {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    padding-top: 6px;
    padding-left: 15px;
  }
}

.ac-card {
  .ac-head {
    padding-top: 9px;
    display: flex;

    .title {
      padding: 10px;
    }
  }
  .reason {
    margin-top: 15px;
  }
  .auditor {
    margin-top: 15px;
  }
}
</style>
