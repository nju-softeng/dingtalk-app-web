<template>
  <div class="app-container">
    <el-tag
      size="medium"
      :type="success"
      effect="dark"
      style="margin-right:5px; padding-left: 15px;padding-right:15px"
    >
      <span>筛 选</span>
    </el-tag>

    <el-date-picker
      v-model="date"
      value-format="yyyy-MM-dd"
      @change="filtrate"
      type="month"
      style="width:120px"
      placeholder="选择月"
    >
    </el-date-picker>

    <el-table :data="list" border style="width: 100%;margin-top:10px;">
      <el-table-column fixed prop="name" label="姓名" width="90">
      </el-table-column>
      <el-table-column prop="week1" label="第1周DC" width="80">
      </el-table-column>
      <el-table-column prop="week2" label="第2周DC" width="80">
      </el-table-column>
      <el-table-column prop="week3" label="第3周DC" width="80">
      </el-table-column>
      <el-table-column prop="week4" label="第4周DC" width="80">
      </el-table-column>
      <el-table-column prop="week5" label="第5周DC" width="80">
      </el-table-column>

      <el-table-column prop="zip" label="总DC" width="80"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
      </el-table-column>
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
      console.log(res);
    });
  },
  methods: {
    filtrate() {
      getDcSummary(this.date).then(res => {
        this.list = res.data;
        console.log(res);
      });
    }
  }
};
</script>
