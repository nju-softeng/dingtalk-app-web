<template>
  <div class="app-container">
    <el-drawer :visible.sync="drawer" :modal="false" :with-header="false" size="50%">
      <div v-if="tableData.length !== 0 && show">
        <div class="drawer-bar">
          <span>{{ tableData[index].dcRecordVO.name }} 的申请</span>
          <el-tag style="margin-left:10px">
            {{
            transitionTime(
            tableData[index].dcRecordVO.yearmonth,
            tableData[index].dcRecordVO.week
            )
            }}
          </el-tag>
        </div>

        <el-card class="box-card">
          <el-button type="danger" @click="rmItem()">删除按钮</el-button>
          <div v-for="(item, index) in report" :key="index" class="text item">
            <li>{{ item.key }}</li>
            <li>{{ item.value }}</li>
          </div>
        </el-card>
      </div>
    </el-drawer>

    <el-tabs v-model="activetab">
      <el-tab-pane label="待审核" name="first">
        <div>
          <el-table
            :data="tableData"
            style="width: 100%"
            :row-style="{ height: '30px' }"
            :row-class-name="tableRowClassName"
            @row-click="onRowClick"
          >
            <el-table-column label="申请时间" width="150" align="center">
              <template slot-scope="{ row }">
                <span>
                  {{
                  row.dcRecordVO.insertTime | parseTime("{y}-{m}-{d} {h}:{i}")
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="申请周" width="100" align="center">
              <template slot-scope="{ row }">
                <span>
                  {{
                  transitionTime(
                  row.dcRecordVO.yearmonth,
                  row.dcRecordVO.week
                  )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="dcRecordVO.name" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="dcRecordVO.dvalue" label="申请D值" align="center" width="80"></el-table-column>
            <el-table-column prop="dcRecordVO.dvalue" label="  AC申请">
              <template slot-scope="{ row }">
                <el-tag v-if="row.acItems.length === 0" style="margin:0px 5px">无</el-tag>
                <el-tag
                  v-for="(item, index) in row.acItems"
                  :key="index"
                  style="margin:0px 5px"
                >{{ item.reason }} : {{ item.ac }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getAudit } from "@/api/application";
import { getReport } from "@/api/audit";
export default {
  data() {
    return {
      drawer: false,
      activetab: "first",
      tableData: [],
      index: 0,
      show: true,
      reportList: null,
      report: null
    };
  },
  components: {},
  computed: {},
  created() {
    getAudit().then(res => {
      this.tableData = res.data;
      console.log(this.tableData);
    });
    getReport().then(res => {
      console.log(res.data);
      this.reportList = res.data;
    });
  },
  methods: {
    transitionTime(yearmonth, week) {
      return yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    onRowClick(row) {
      console.log("行索引： " + row.index);
      this.drawer = !this.drawer;
      this.index = row.index;
      let value = this.reportList.filter(item => {
        return item.uid == this.tableData[row.index].dcRecordVO.uid;
      });
      if (value instanceof Array) {
        this.report = value[0].contents;
      } else {
        this.report = value.contents;
      }
    },
    rmItem() {
      console.log(this.index);
      if (this.index !== this.tableData.length - 1) {
        this.tableData.splice(this.index, 1);
      } else {
        this.show = false;
        this.tableData.splice(this.index, 1);
        this.index--;
        this.show = true;
      }
    }
  }
};
</script>

<style scoped>
.drawer-bar {
  display: flex; /*Flex布局*/
  align-items: center; /*指定垂直居中*/
  padding: 0px 20px;
  width: 100%;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.drawer-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.app-container >>> .el-drawer__body {
  height: 0;
}

.el-table tr {
  height: 10px;
}
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  margin-top: 2px;
  font-size: 12px;
  width: 100%;
  height: 400px;
  overflow: auto;
}
</style>
