<template>
  <div>
    <el-row :gutter="10">
      <el-col v-for="(item,index) in list" :xs="24" :sm="8" :md="6" :lg="6">
        <div class="card">

          <div class="title" style="min-height: 53px">
            {{ item.title }}
          </div>
          <div class="info">
            <div class="info-item">投票时间</div>
            <div class="info-item">{{ item.startTime | parseTime("{h}:{i}") }} ~ {{ item.endTime | parseTime("{h}:{i}") }}</div>
          </div>
          <div class="action" style=" display:flex; justify-content: flex-end; align-items: center; ">

            <div style="margin-right: 20px"><i class="el-icon-edit" /></div>
            <div style="margin-right: 20px"><i class="el-icon-share" /></div>
            <div style="margin-right: 20px"><i class="el-icon-delete" /></div>

          </div>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="8"
        :md="6"
        :lg="6"
      >
        <div class="grid-content bg-purple-light" style="height:165px;margin-bottom:10px" /></el-col>
      <el-col
        :xs="24"
        :sm="8"
        :md="6"
        :lg="6"
      >
        <div class="grid-content bg-purple" style="height:165px;margin-bottom:10px" /></el-col>
      <el-col
        :xs="24"
        :sm="8"
        :md="6"
        :lg="6"
      ><div class="grid-content bg-purple-light" style="height:165px;margin-bottom:10px" /></el-col>

    </el-row>
  </div>
</template>

<script>
import { listExReview } from '@/api/ex-review'

export default {
  name: 'PaperExternal',
  data() {
    return {
      list: []
    }
  },
  created() {
    listExReview().then(res => {
      this.list = res.data
      console.log(this.list)
    })
    this.$message({
      showClose: true,
      message: '外部评审正在开发中，目前无法使用',
      type: 'warning',
      offset: '100',
      duration: '5000'
    });
  },
  mounted() {
  }

}
</script>

<style lang="scss" scoped>

.card {
  margin-bottom:10px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  .title {
    padding: 16px 16px 1px;
  }
  .info {
    height: 64px;
    .info-item {
      text-align:center;
      padding-top:12px;
      font-size: 13px;
    }
  }
  .action {
    height: 40px;
    border-top: 1px solid #e6ebf5;
    //background: #e5e9f2;
  }

}

.title {
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
.box-card {
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
