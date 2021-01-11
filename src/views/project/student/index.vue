<template>
  <div class="app-container">
    <div class="box">
      <el-tabs v-model="activeTab" tab-position="top">
        <el-tab-pane label="我参与的" name="myIteration" />
        <el-tab-pane label="我的bug" name="userbug" />
        <el-tab-pane label="所有项目" name="devlist" />
      </el-tabs>

      <component :is="activeTab" />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    myIteration: () => import('../components/myIteration'),
    userbug: () => import('../components/userbug'),
    devlist: () => import('../components/devlist')
  },
  data() {
    return {
      unfinish: true,
      activeTab: 'myIteration'
    }
  },
  created() {
    this.activeTab = this.$route.query.tab || 'myIteration'
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
  padding: 10px;
  background-color: #fafafa;
}

.box {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding: 5px 20px;
  min-height: 530px;
}

@media only screen and (min-width: 1400px) {
  .box {
    max-width: 1305px !important;
  }
}

</style>
