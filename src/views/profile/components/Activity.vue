<template>
  <div class="user-activity">
    <div class="post" v-for="(dc, index) in list" :key="index">
      {{ dc }}
    </div>
    <div style="text-align:center">
      <el-pagination @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" background hide-on-single-page="total > 10" small layout="prev, pager, next" :total="total" :page-size="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserApplication } from "@/api/application";

export default {
  data() {
    return {
      list: [],
      total: 0
    };
  },
  created() {
    getUserApplication(0).then(res => {
      this.list = res.data.list;
      this.total = res.data.total;
      console.log(this.list);
    });
  },
  methods: {
    // 分页获取数据
    handleCurrentChange(val) {
      getUserApplication(val - 1).then(res => {
        this.list = res.data.list;
      });
    },
    handlePrev(val) {
      getUserApplication(val - 1).then(res => {
        this.list = res.data.list;
      });
    },
    handleNext(val) {
      getUserApplication(val - 1).then(res => {
        this.list = res.data.list;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
