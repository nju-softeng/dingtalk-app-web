<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="8" :md="6" :lg="6">
        <div class="card">
            <div class="title" >
              How does grey literature feed in and contribute to software engineering research? Taking Stack Overflow as a case
            </div>
            <div class="info">
              <div class="info-item">投票开始时间</div>
              <div class="info-item">2020-10-05</div>
            </div>
          <div class="action" style=" display:flex; justify-content: flex-end; align-items: center; ">

              <div style="margin-right: 20px"><i class="el-icon-edit"></i></div>
              <div style="margin-right: 20px"><i class="el-icon-share"></i></div>
              <div style="margin-right: 20px"><i class="el-icon-delete"></i></div>

          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="6" :lg="6"
        >
        <div class="grid-content bg-purple-light" style="height:165px;margin-bottom:10px"></div
      ></el-col>
      <el-col :xs="24" :sm="8" :md="6" :lg="6"
        >
        <div class="grid-content bg-purple" style="height:165px;margin-bottom:10px"></div
      ></el-col>
      <el-col :xs="24" :sm="8" :md="6" :lg="6"
        ><div class="grid-content bg-purple-light" style="height:165px;margin-bottom:10px"></div
      ></el-col>


    </el-row>
  </div>
</template>

<script>
export default {
  name: "paperExternal"
};
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
