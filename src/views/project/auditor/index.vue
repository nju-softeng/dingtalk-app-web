<template>
  <div class="app-container">
    <div class="box">
      <el-tabs v-model="activeTab" tab-position="top">
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
  components: {
    assign: () => import('../components/assign'),
    auditbug: () => import('../components/auditbug'),
    devlist: () => import('../components/devlist')
  },
  data() {
    return {
      activeTab: 'assign'
    }
  },
  created() {
    this.activeTab = this.$route.query.tab || 'assign'
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.dialog-content {
  display: flex;
  justify-content: center;
}

.app-container {
  padding: 16px;
  background-color: #fafafa;
}

.box {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 530px;
  background: #fff;
  padding: 5px 20px 0 20px;
}

@media only screen and (min-width: 1400px) {
  .box {
    max-width: 1305px !important;
  }
}

</style>
