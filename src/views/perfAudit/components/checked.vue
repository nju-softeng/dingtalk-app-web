<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="申请时间" width="180">
      </el-table-column>
      <el-table-column prop="name" label="申请周" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="审核结果"> </el-table-column>
      <el-table-column prop="address" label="操作"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getChecked } from "@/api/audit";
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created() {
    getChecked().then(res => {
      console.log(res.data);
    });
    console.log("hello checked");
  }
};
</script>
