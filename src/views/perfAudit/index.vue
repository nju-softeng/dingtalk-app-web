<template>
  <div class="app-container">
    <el-drawer title="我是标题" :visible.sync="drawer" :modal="false" :with-header="false" size="50%">
      <div class="drawer-bar">
        <span>{{ obj.dcRecordVO.name }}</span>
      </div>
      <test v-bind:data="obj" />
      <div>{{ obj }}</div>
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
export default {
  data() {
    return {
      drawer: false,
      activetab: "first",
      tableData: [],
      index: null,
      obj: {
        dcRecordVO: {
          name: null,
          yearmonth: null,
          week: null
        }
      }
    };
  },
  components: {
    test: () => import("@/views/test/index")
  },
  computed: {
    transitionTime() {
      return (yearmonth, week) => {
        return yearmonth.toString().slice(4, 7) + " 月 第 " + week + " 周";
      };
    }
  },
  created() {
    getAudit().then(res => {
      this.tableData = res.data;
      console.log(this.tableData);
    });
  },
  methods: {
    tableRowClassName({ row, index }) {
      //把每一行的索引放进row
      row.index = index;
    },
    onRowClick(row) {
      this.drawer = !this.drawer;
      this.obj = row;
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

.test {
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-table tr {
  height: 10px;
}
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
}

.box-card {
  width: 100%;
  margin-bottom: 10px;
  overflow: auto;
  height: 0;
}
</style>
