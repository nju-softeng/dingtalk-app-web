<template>
  <div class="user-activity">
    <!-- 列表为null提示 -->
    <template v-if="list.length == 0">
      <div style="height:200px;text-align:center;padding-top:70px;">
        <svg-icon icon-class="null" style="font-size:32px" />
      </div>
    </template>

    <!-- 内容列表 -->
    <div v-for="(dc, index) in list" :key="index" class="post" style="display:flex; justify-content:space-between">
      <div>
        <span style="padding-right:15px;color: #1890ff;">{{
          dc.yearmonth | formatWeek(dc.week)
        }}</span>
        <span style="padding:10px;color: rgba(0, 0, 0, 0.45);">审核人:{{ dc.auditorName }}</span>

        <div v-if="!dc.status" style="padding-top:10px">
          <span style="padding-right:10px">&bull; D值: {{ dc.dvalue }}</span>
          <el-tag effect="plain"> 待审核</el-tag>
        </div>
        <div v-else style="padding-top:10px">
          <span style="padding-right:10px;">&bull; DC值: {{ dc.dc }}</span>
          <span style="padding:10px;">&bull; AC值: {{ dc.ac }}</span>
        </div>
      </div>
      <div style="padding-top:32px;font-size:12px">
        <span>申请时间：
          {{ dc.insertTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
      </div>
    </div>

    <!-- 分页按钮 -->
    <div style=" text-align:center">
      <el-pagination background :hide-on-single-page="total < 10 ? true : false" small layout="prev, pager, next" :total="total" :page-size="10" @prev-click="handlePrev" @next-click="handleNext" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { listApplication } from '@/api/application'

export default {
  data() {
    return {
      list: [],
      total: 0
    }
  },
  created() {
    listApplication(1, 10).then(res => {
      this.list = res.data.list || []
      this.total = res.data.total || 0
      console.log(this.total)
      console.log(this.list)
    })
  },

  methods: {
    // 分页获取数据
    handleCurrentChange(val) {
      listApplication(val, 10).then(res => {
        this.list = res.data.list
      })
    },
    handlePrev(val) {
      listApplication(val, 10).then(res => {
        this.list = res.data.list
      })
    },
    handleNext(val) {
      listApplication(val, 10).then(res => {
        this.list = res.data.list
      })
    }
  }
}
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
    border-bottom: 0.5px solid #d2d6de;
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
