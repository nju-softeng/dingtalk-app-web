<template>
  <div class="app-container">
    <div class="box">
      <el-date-picker size="small" v-model="date" value-format="yyyy-MM-dd" @change="filtrate" type="month" style="width:120px" placeholder="选择月">
      </el-date-picker>
      <el-button-group style="margin-left:5px">
        <el-button type="primary" @click="prev" icon="el-icon-arrow-left">上一月</el-button>
        <el-button type="primary" @click="next">下一月<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
      <el-table class="table" stripe :data="list" border style="margin-top:10px;" height="77.5vh">
        <el-table-column fixed prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="salary" label="助研金"> </el-table-column>
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
  </div>
</template>

<script>
import { getDcSummary } from "@/api/performance";
export default {
  data() {
    return {
      list: null,
      date: new Date()
    };
  },
  created() {
    getDcSummary(new Date()).then(res => {
      this.list = res.data;
    });
  },
  methods: {
    filtrate() {
      if (this.date != undefined) {
        getDcSummary(this.date).then(res => {
          this.list = res.data;
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择月份",
          type: "warning"
        });
      }
    },
    next() {
      if (typeof this.date == "string") {
        this.date = new Date(this.date);
      }
      this.date.setMonth(this.date.getMonth() + 1);
      this.date = this.date.toISOString().slice(0, 10);
      getDcSummary(this.date).then(res => {
        this.list = res.data;
      });
    },
    prev() {
      if (typeof this.date == "string") {
        this.date = new Date(this.date);
      }
      this.date.setMonth(this.date.getMonth() - 1);
      this.date = this.date.toISOString().slice(0, 10);
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

.app-container {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 92vh;
  border-radius: 0;
}

.box {
  background: #fff;
  padding: 10px 15px;
  min-height: 89vh;
}
</style>
