<template>
  <div class="app-container">
    <div class="action" @click="dialog = true" style="margin-bottom:10px">
      <el-button type="primary" icon="el-icon-plus">报告bug</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="address" label="日期"></el-table-column>
        <el-table-column prop="date" label="项目名称" width="180">
        </el-table-column>
        <el-table-column prop="name" label="bug描述" width="180">
        </el-table-column>
        <el-table-column prop="address" label="状态"> </el-table-column>
        <el-table-column prop="address" label="bug责任人"> </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialog" width="55%">
      <div slot="title">
        <span class="title-age">报告bug</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  create() {},
  methods: {
    submit() {}
  }
};
</script>
