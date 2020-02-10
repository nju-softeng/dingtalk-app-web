<template>
  <div>
    <div class="page-header">
      <p class="day-text muted">
        『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》
        <a class="muted" @click="getYiYan">
          <el-button type="text" icon="el-icon-refresh"></el-button>
        </a>
      </p>
      <div class="header-content">
        <div class="left-content">
          <el-avatar class="avatar" shape="square" :size="50" :src="avatar"></el-avatar>

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
    </div>
    <div class="dashboard-editor-container">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <div style="height:200px"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <div style="height:200px"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <div style="height:200px"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :xs="{ span: 24 }" :sm="{ span: 24 }" :md="{ span: 24 }" :lg="{ span: 12 }" :xl="{ span: 12 }" style="padding-right:8px;margin-bottom:30px;">
          <div class="chart-wrapper"></div>
        </el-col>
        <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 12 }" :lg="{ span: 6 }" :xl="{ span: 6 }" style="margin-bottom:30px;">
          <todo-list />
        </el-col>
        <el-col :xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 12 }" :lg="{ span: 6 }" :xl="{ span: 6 }" style="margin-bottom:30px;">
          <div class="chart-wrapper">
            <div style="height:500px"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { showHelloTime } from "@/utils/index";
import { getYiYan } from "@/api/other";
import TodoList from "./components/TodoList";

export default {
  name: "DashboardAdmin",
  components: {
    TodoList
  },
  data() {
    return {
      name: "",
      yiyan: {},
      avatar: null
    };
  },
  created() {
    this.avatar = sessionStorage.getItem("avatar");
    this.name = sessionStorage.getItem("name");
    this.getYiYan();
  },
  computed: {
    helloTime() {
      return showHelloTime();
    }
  },
  methods: {
    getYiYan() {
      getYiYan("d").then(res => {
        console.log(res.data);
        this.yiyan = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-width: 1px 0 0 0;
  border-style: solid;
  border-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  .day-text {
    padding-left: 10px;
    font-size: 12px;
    color: rgb(116, 116, 116);
  }
  .header-content {
    margin-bottom: 16px;
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
}

.dashboard-editor-container {
  padding: 12px;
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
</style>
