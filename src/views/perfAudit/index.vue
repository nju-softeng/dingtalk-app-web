<template>
  <div class="app-container">
    <div class="box">
      <el-tabs v-model="activetab">
        <el-tab-pane label="待审核" name="checking">
          <span slot="label"><i class="el-icon-s-claim" /> 待审核</span>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="checked" />
      </el-tabs>
      <component :is="activetab" />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    checking: () => import('./components/checking'),
    checked: () => import('./components/checked')
  },
  data() {
    return {
      activetab: 'checking'
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 10px 12px;
  background-color: #fafafa;
  border-radius: 0;
}

.box {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding: 10px 15px;
  min-height: 530px;
}

@media only screen and (min-width: 1400px) {
  .box {
    max-width: 1305px !important;
  }
}

</style>
