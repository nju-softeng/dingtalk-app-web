<template>
  <div class="app-container">
    <el-date-picker
      v-model="date"
      value-format="yyyy-MM-dd"
      @change="filtrate"
      type="month"
      style="width:120px"
      placeholder="选择月"
    >
    </el-date-picker>
    <el-button-group style="margin-left:5px">
      <el-button type="primary" icon="el-icon-arrow-left">上一月</el-button>
      <el-button type="primary"
        >下一月<i class="el-icon-arrow-right el-icon--right"></i
      ></el-button>
    </el-button-group>
    {{ date }}
    <el-table :data="list" border style="width: 100%;margin-top:10px;">
      <el-table-column fixed prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="salary" label="补贴总金额"> </el-table-column>
      <el-table-column prop="week1" label="第一周DC"> </el-table-column>
      <el-table-column prop="week2" label="第二周DC"> </el-table-column>
      <el-table-column prop="week3" label="第三周DC"> </el-table-column>
      <el-table-column prop="week4" label="第四周DC"> </el-table-column>
      <el-table-column prop="week5" label="第五周DC"> </el-table-column>
      <el-table-column prop="total" label="本月总DC"> </el-table-column>
      <el-table-column prop="ac" label="当前AC值"> </el-table-column>
      <el-table-column prop="topup" label="Topup"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDcSummary } from "@/api/performance";
export default {
  data() {
    return {
      list: null,
      date: ""
    };
  },
  created() {
    this.date = new Date();
    getDcSummary(this.date).then(res => {
      this.list = res.data;
      console.log(res.data);
    });
  },
  methods: {
    filtrate() {
      getDcSummary(this.date).then(res => {
        this.list = res.data;
      });
    }
  }
};
</script>
<style scoped>
.app-container >>> .el-table th.gutter {
  display: table-cell !important;
}
</style>
