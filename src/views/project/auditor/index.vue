<template>
  <div class="app-container">
    <div class="box">
      <el-tabs tab-position="top" v-model="activeTab">
        <el-tab-pane label="任务分配" name="assign" />
        <el-tab-pane label="bug管理" name="auditbug" />
        <el-tab-pane label="实验室所有项目" name="devlist" />
      </el-tabs>
      <component :is="activeTab" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTab: 'assign'
    };
  },
  components: {
    assign: () => import('../components/assign'),
    auditbug: () => import('../components/auditbug'),
    devlist: () => import('../components/devlist')
  },
  created() {
    this.activeTab = this.$route.query.tab || 'assign';
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.dialog-content {
  display: flex;
  justify-content: center;
}

.app-container {
  padding: 16px;
  background-color: #f5f5f5;
  min-height: 95vh;
}

.box {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  min-height: 530px;
  background: #fff;
  padding: 5px 20px 0 20px;
}
</style>
