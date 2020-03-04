<template>
  <div>
    <div class="dashboard-container">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="16" :lg="16">
          <div style="height:107.67px; margin-bottom: 5px; display:flex">
            <el-card shadow="never" class="head">
              <div class="title">本月DC值</div>
              <div class="content">1.44</div>
              <div class="rank">
                排名:
              </div>
            </el-card>
            <el-card shadow="never" class="head">
              <div class="title">累计AC</div>
              <div class="content">
                12.5
              </div>
            </el-card>
            <el-card shadow="never" class="head">
              <div class="title">参与项目</div>
              <div class="content">
                0
              </div>
            </el-card>
            <el-card shadow="never" class="head">
              <div class="title">bug数</div>
              <div class="content">
                0
              </div>
            </el-card>
          </div>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>动态</span>
              <router-link to="/profile/index">
                <el-button style="float: right;padding:0" type="text">查看更多</el-button>
              </router-link>
            </div>

            <div class="message" v-for="msg in messages" :key="msg.index">
              <div class="title">{{ msg.title }}</div>
              <div style="display:flex">
                <div class="content">
                  <span>{{ msg.content }}</span>
                </div>
                <div class="time">
                  <span>{{ new Date(msg.createTime) | timeAgo }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="8">
          <el-card class="box-card" shadow="never" style="margin-bottom: 5px;">
            <div slot="header" class="clearfix">
              <span>快捷导航</span>
            </div>
            <div class="shortcut">
              <div class="item">
                <el-link type="primary">绩效申请</el-link>
              </div>
              <div class="item">
                <el-link type="primary">绩效汇总</el-link>
              </div>
              <div class="item">
                <el-link type="primary">AC汇总</el-link>
              </div>
              <div class="item">
                <el-link type="primary">主要链接</el-link>
              </div>
              <div class="item">
                <el-link type="primary">主要链接</el-link>
              </div>
              <div class="item">
                <el-link type="primary">主要链接</el-link>
              </div>
            </div>
          </el-card>

          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>AC变动公告</span>
              <el-button style="float: right; padding:0" type="text">查看详情</el-button>
            </div>
            <el-carousel trigger="click" height="150px">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="small">{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { showHelloTime } from "@/utils/index";
import { getMessages } from "@/api/message";
export default {
  data() {
    return {
      messages: [],
      name: "",
      avatar: null,
      count: 0
    };
  },
  created() {
    this.avatar = sessionStorage.getItem("avatar");
    this.name = sessionStorage.getItem("name");
    getMessages(0).then(res => {
      this.messages = res.data.content;
      console.log(this.messages);
    });
  },
  computed: {
    helloTime() {
      return showHelloTime();
    }
  },
  methods: {
    load() {
      this.count += 2;
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

.head {
  width: 25%;
  .title {
    padding: 6px 0px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
  .content {
    font-size: 25px;
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

  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.shortcut {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
</style>
