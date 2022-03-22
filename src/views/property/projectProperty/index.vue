<template>
  <div class="app-container">
    <div class="projectWrap">
      <div class="projectBox">
        <div class="projectList">
          aaa
        </div>
        <div class="pagination">
          <el-pagination
            background
            :current-page.sync="currentPage"
            :hide-on-single-page="total < 10 ? true : false "
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
  </div>
</template>

<script>
export default {
  name: 'ProjectProperty',
  methods: {
    // 上一页
    handlePrev(val) {
      this.fetchApplication(val)
    },
    // 下一页
    handleNext(val) {
      this.fetchApplication(val)
    },
    // 分页获取数据
    handleCurrentChange(val) {
      this.fetchApplication(val)
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

  .projectWrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .projectBox {
    background: #fff;
    padding: 10px 15px;
    min-height: 540px;
  }

  @media only screen and (min-width: 1400px) {
    .projectBox {
      max-width: 1305px !important;
    }
  }

  .projectList {
      min-height: 500px;
  }

  .pagination {
      margin-top:16px;
      display:flex;
      justify-content:center;
  }
</style>
