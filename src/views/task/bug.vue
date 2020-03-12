<template>
  <div class="app-container">
    <div class="action" @click="dialog = true" style="margin-bottom:10px">
      <el-button type="primary" icon="el-icon-plus">报告bug</el-button>
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
