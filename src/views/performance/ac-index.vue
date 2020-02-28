<template>
  <div class="app-container">
    <el-card shadow="never" class="box-card">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="total" label="总AC"> </el-table-column>
      </el-table>
    </el-card>
    <div class="box-card">
      <el-scrollbar style="height: 100%;">
        <el-timeline>
          <el-timeline-item timestamp="2018/4/2" placement="top">
            <div class="test">
              <el-card class="ac-card">
                <h5>更新 Github 模板</h5>
                <p>王小虎 提交于 2018/4/2 20:46</p>
              </el-card>
            </div>
          </el-timeline-item>
          <el-timeline-item timestamp="2018/4/2" placement="top">
            <el-card class="ac-card">
              <h5>更新 Github 模板</h5>
              <p>王小虎 提交于 2018/4/2 20:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getAcSummary } from "@/api/performance";

export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    getAcSummary().then(res => {
      this.list = res.data;
    });
  },

  methods: {}
};
</script>
<style lang="scss" scoped>
.app-container {
  display: flex;
  justify-content: space-between;
}
.box-card {
  width: 50%;
  height: 85vh;
  padding: 10px 0px;
  // overflow: auto;
}
.ac-card {
  width: 85%;
}
.box-card /deep/ .el-card__body {
  padding: 0px 20px;
}

.box-card /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
