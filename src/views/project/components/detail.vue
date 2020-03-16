<template>
  <div class="app-container">
    <el-page-header @back="goBack">
      <span slot="title" style="font-size:12.5px">
        返回
      </span>
      <span slot="content" style="font-size:12.5px">
        项目迭代
      </span>
    </el-page-header>

    <div class="info"></div>

    <div class="iterate">
      <div class="action" @click="dialog = true" style="margin-bottom:10px">
        <el-button style="float:right" @click="drawer = !drawer" type="primary" icon="el-icon-plus">新建迭代</el-button>
      </div>

      <el-table :show-header="theader" border :data="tableData" style="width: 100%">
        <el-table-column label="日期" width="180">
          <template slot-scope="scope">
            <div>
              第1次迭代
            </div>
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }} ~ {{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" width="180">
          <template slot-scope="scope">
            <div>
              完成时间
            </div>

            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" width="180">
          <template slot-scope="scope">
            <div>
              完成时间
            </div>

            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <div>开发者</div>
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer title="我是标题" size="90%" :visible.sync="drawer" direction="btt" :before-close="handleClose">
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
      dialog: false,
      theader: false,
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
  create() {},
  methods: {
    submit() {},
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 10px;
  background-color: #f5f5f5;
  height: 100vh;
  border-radius: 0;
}

.info {
  background-color: #ffffff;
  margin-top: 5px;
  height: 100px;
}

.iterate {
  background-color: #ffffff;
  margin-top: 10px;
  height: 80vh;
  padding: 20px;
}
</style>
