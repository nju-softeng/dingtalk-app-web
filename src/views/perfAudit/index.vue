<template>
  <div class="app-container">
    <el-tabs v-model="activetab">
      <el-tab-pane label="待审核" name="first">
        <div>
          <template>
            <el-table :data="tableData" style="width: 100%" :row-style="{ height: '40px' }">
              <el-table-column label="申请时间" width="150" align="center">
                <template slot-scope="{ row }">
                  <span>
                    {{
                    row.dcRecordVO.insertTime
                    | parseTime("{y}-{m}-{d} {h}:{i}")
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="dcRecordVO.name" label="姓名" align="center" width="100"></el-table-column>
              <el-table-column prop="dcRecordVO.dvalue" label="申请D值" align="center" width="90"></el-table-column>
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
          </template>
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
      activetab: "first",
      tableData: []
    };
  },
  created() {
    getAudit().then(res => {
      this.tableData = res.data;
      console.log(this.tableData);
    });
  },
  methods: {}
};
</script>

<style>
.el-table td {
  padding: 200px 0px;
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
}
</style>
