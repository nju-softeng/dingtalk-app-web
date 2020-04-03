<template>
  <div class="dashboard-container">
    <div class="wrap">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="16" :lg="16">
          <!-- 四位展示板 -->
          <div style="height:107.67px; margin-bottom: 5px; display:flex">
            <el-card shadow="never" class="head">
              <div class="title">本月DC值</div>
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

                  <div slot="reference" class="content">{{ perf.dcTotal }}</div>
                </el-popover>
              </div>
              <!-- <div class="rank">
                排名:
              </div> -->
            </el-card>
            <el-card @click.native="goAc" shadow="never" class="head" style="cursor:pointer;">
              <div class="title">累计AC</div>
              <div class="content">
                {{ perf.acTotal }}
              </div>
            </el-card>
            <el-card @click.native="goAuditor" shadow="never" class="head" style="cursor:pointer">
              <div class="title">待审核申请</div>
              <div class="content">
                {{ unCheckCnt }}
              </div>
            </el-card>
            <el-card @click.native="goBug" shadow="never" class="head" style="cursor: pointer">
              <div class="title">待审核bug</div>
              <div class="content">
                {{ bugCnt }}
              </div>
            </el-card>
          </div>
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
              <div class="message" v-for="(msg, index) in messages" :key="index">
                <div class="title">{{ msg.title }}</div>
                <div style="display:flex;justify-content:space-between;">
                  <div class="content">
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
          <!-- 快捷导航 -->
          <el-card class="box-card" shadow="never" style="margin-bottom: 5px;">
            <div slot="header" class="clearfix">
              <span>快捷导航</span>
            </div>
            <div class="shortcut">
              <div class="item">
                <router-link to="/performance/perfAudit">
                  <el-link type="primary">绩效审核</el-link>
                </router-link>
              </div>
              <div class="item">
                <router-link to="/performance/performance_dc">
                  <el-link type="primary">绩效汇总</el-link>
                </router-link>
              </div>
              <div class="item">
                <router-link to="/performance/performance_ac">
                  <el-link type="primary">AC汇总</el-link>
                </router-link>
              </div>
              <div class="item">
                <router-link to="/project/index">
                  <el-link type="primary">迭代管理 </el-link>
                </router-link>
              </div>

              <div class="item">
                <router-link to="/paper/index">
                  <el-link type="primary">论文管理</el-link>
                </router-link>
              </div>
            </div>
          </el-card>

          <!-- AC变动公告 -->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>AC变动公告</span>
              <!-- <el-button style="float: right; padding:0" type="text">查看详情</el-button> -->
            </div>
            <el-carousel indicator-position="none" trigger="click" height="150px">
              <el-carousel-item v-for="(item, index) in lastAcs" :key="index">
                <div class="ac-card">
                  <div class="ac-head">
                    <el-avatar :size="35" class="avatar">{{
                      item.username
                    }}</el-avatar>
                    <div class="title">
                      <span>{{ item.username }} AC值</span>
                      <span v-if="item.ac > 0"> + </span>
                      <span>{{ item.ac }}</span>
                    </div>
                  </div>
                  <div class="reason" style="font-size:12.5px">
                    <span>变更原因：{{ item.reason }}</span>
                  </div>
                  <div class="auditor" style="font-size:12.5px" v-if="item.auditorname != undefined">
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
</template>

<script>
import { getMessages } from "@/api/message";
import { lastAc, getPerformance } from "@/api/performance";
import { getUnCheckCnt } from "@/api/audit";
import { getAuditorBugCnt } from "@/api/bug";

export default {
  data() {
    return {
      messages: [],
      lastAcs: [],
      unCheckCnt: 0,
      perf: {
        dcTotal: "",
        acTotal: "",
        w1: "",
        w2: "",
        w3: "",
        w4: "",
        w5: ""
      },
      name: "",
      avatar: null,
      count: 0,
      bugCnt: 0
    };
  },
  created() {
    this.avatar = sessionStorage.getItem("avatar");
    this.name = sessionStorage.getItem("name");
    // 消息
    getMessages(0, 5).then(res => {
      this.messages = res.data.content;
    });
    // 实验室最近AC变更
    lastAc().then(res => {
      this.lastAcs = res.data;
    });
    // 绩效
    getPerformance().then(res => {
      this.perf = res.data;
    });
    // 审核人未审核数
    getUnCheckCnt().then(res => {
      this.unCheckCnt = res.data;
    });
    // 查询待审核bug
    getAuditorBugCnt().then(res => {
      this.bugCnt = res.data;
    });
  },
  computed: {},
  methods: {
    goAuditor() {
      this.$router.push({ path: "/performance/perfAudit" });
    },
    goAc() {
      this.$router.push({
        path: "/profile/index",
        query: {
          tab: "actab"
        }
      });
    },
    goBug() {
      this.$router.push({
        path: "/project/index",
        query: {
          tab: "auditbug"
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container /deep/ .el-card__header {
  padding: 12px 20px;
  font-size: 14px;
}

.dashboard-container /deep/ .el-card__body {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
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

.head {
  width: 25%;
  .title {
    padding: 6px 0px;
    font-size: 14px;

    color: rgba(0, 0, 0, 0.45);
  }
  .content {
    font-size: 25px;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
  }
  .rank {
    margin-top: 8px;
    padding-top: 8px;
    border-top: #d2d6de 0.5px solid;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}

.dashboard-container {
  padding: 12px;
  min-height: 90vh;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.wrap {
  max-width: 1072px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.shortcut {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .item {
    padding: 5px;
  }
}
.message {
  font-size: 14px;
  border-bottom: 0.5px solid #d2d6de;
  margin-bottom: 10px;
  padding-bottom: 10px;

  .title {
    color: #1890ff;
    line-height: 24px;
    height: 24px;
    font-size: 14px;
    display: inline-block;
  }
  .content {
    padding-top: 6px;
    white-space: pre;
  }
  .time {
    color: rgba(0, 0, 0, 0.45);
    padding-top: 6px;
    padding-left: 15px;
  }
}
.ac-card {
  .ac-head {
    padding-top: 9px;
    display: flex;
    .avatar {
      background-color: #409eff;
    }
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
