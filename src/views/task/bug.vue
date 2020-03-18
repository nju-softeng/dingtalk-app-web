<template>
  <div class="app-container">
    <div class="action" @click="dialog = true" style="margin-bottom:10px">
      <el-button type="primary" icon="el-icon-plus">报告bug</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="address" label="日期"> </el-table-column>
        <el-table-column prop="date" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="name" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="address" label="状态"> </el-table-column>
        <el-table-column prop="address" label="等级"> </el-table-column>
        <template slot="empty">
          <div style="height:300px;">
            <div style="margin-top:100px;">
              <svg-icon icon-class="null" style="font-size:32px" /> <br />
            </div>
            <div style="line-height: 10px;">
              <span>没有bug记录</span>
            </div>
          </div>
        </template>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialog" @close="clearProjectForm" width="55%">
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
