<template>
  <div>
    <!-- <div class="page-header">
      <div class="header-content">
        <div class="left-content">
          <el-avatar class="avatar" shape="square" :size="40" :src="avatar"></el-avatar>

          <div class="user-info title">
            {{ helloTime }}{{ name }}，祝你开心每一天！
          </div>
        </div>
        <div class="right-content">
          <div class="content-item">
            <div class="item-title muted">
              当前AC值
            </div>
            <div class="item-text">
              <span>xxxxxx</span>
            </div>
          </div>
          <div class="content-item">
            <div class="item-title muted">
              本月DC排名
            </div>
            <div class="item-text">
              <span>2 <span class="small muted">/ 8</span> </span>
            </div>
          </div>
          <div class="content-item">
            <div class="item-title muted">
              项目总数
            </div>
            <div class="item-text">
              <span>xxxx</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="header">
      <div class="left-content">
        <el-avatar class="avatar" shape="square" :size="40" :src="avatar"></el-avatar>

        <div class="user-info title">
          {{ helloTime }}{{ name }}，祝你开心每一天！
        </div>
      </div>
      <div class="right-content">
        <div class="content-item">
          <div class="item-title muted">
            当前AC值
          </div>
          <div class="item-text">
            <span>xxxxxx</span>
          </div>
        </div>
        <div class="content-item">
          <div class="item-title muted">
            本月DC排名
          </div>
          <div class="item-text">
            <span>2 <span class="small muted">/ 8</span> </span>
          </div>
        </div>
        <div class="content-item">
          <div class="item-title muted">
            项目总数
          </div>
          <div class="item-text">
            <span>xxxx</span>
          </div>
        </div>
      </div>
    </div> -->
    <div class="dashboard-container">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="16" :lg="16">
          <el-card shadow="never" style="height:50px; margin-bottom: 5px">
            studentDashboard
          </el-card>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>动态</span>
              <el-button style="float: right;padding:0" type="text">查看更多</el-button>
            </div>

            <div class="message" v-for="msg in messages" :key="msg.index">
              <p>{{ msg.title }}</p>
              <span>{{ msg.content }}</span>
              <span style="padding:20px">{{ msg.createTime }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="8">
          <el-card class="box-card" shadow="never">
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
            <div v-for="o in 4" :key="o" class="text item"></div>
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
  padding: 14px 20px;
  font-size: 14px;
}

.header {
  height: 70px;
  display: flex;
  justify-content: space-between;
  .left-content {
    display: flex;
    align-items: center;
    flex-direction: row;
    .avatar {
      margin-left: 15px;
    }
    .user-info {
      margin-left: 12px;
      line-height: 33px;

      .title {
        font-size: 20px;
      }
    }
  }

  .right-content {
    display: flex;

    .content-item {
      padding: 0 32px;
      position: relative;

      .item-text {
        font-size: 30px;

        .small {
          font-size: 20px;
        }
      }

      &:after {
        background-color: #e8e8e8;
        position: absolute;
        top: 8px;
        right: 0;
        width: 1px;
        height: 40px;
        content: "";
      }

      &:last-child {
        &:after {
          width: 0;
        }
      }
    }
  }
}

.dashboard-container {
  padding: 12px;
  height: 79vh;
  background-color: rgb(240, 242, 245);
  position: relative;

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
  border-bottom: 1px solid #d2d6de;
  margin-bottom: 15px;
  padding-bottom: 15px;
  color: #666;
}
</style>
