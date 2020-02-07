<template>
  <div class="app-container">
    <el-date-picker v-model="value2" type="month" style="width:120px" placeholder="选择月">
    </el-date-picker>
    <el-button type="primary" icon="el-icon-search" style="margin:0 0 15px 5px">
      筛选
    </el-button>

    <el-table :data="list" style="width: 100%">
      <el-table-column label="姓名">
        <template slot-scope="{ row }">{{
          row.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
        }}</template>
      </el-table-column>
      <el-table-column label="第一周">
        <template slot-scope="{ row }">
          {{ row.yearmonth | formatWeek(row.week) }}
        </template>
      </el-table-column>
      <el-table-column label="第二周">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="第三周">
        <template slot-scope="{ row }">
          <el-tag style="margin-right:10px">DC值：{{ row.dc }} </el-tag>
          <el-tag>AC值：{{ row.ac }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="第四周">
        <template slot-scope="{ row }">
          <el-tag>AC值：{{ row.ac }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="第五周">
        <template slot-scope="{ row }">
          <el-tag>AC值：{{ row.ac }} </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  }
};
</script>
