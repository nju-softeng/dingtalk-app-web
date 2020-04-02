<template>
  <div class="app-container">
    <div class="box">
      <el-tabs v-model="activetab">
        <el-tab-pane label="待审核" name="checking">
          <span slot="label"><i class="el-icon-s-claim"></i> 待审核</span>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="checked"> </el-tab-pane>
      </el-tabs>
      <component v-bind:is="activetab"></component>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activetab: "checking"
    };
  },
  components: {
    checking: () => import("./components/checking"),
    checked: () => import("./components/checked")
  }
};
</script>

<style scoped>
.app-container {
  padding: 10px 12px;
  background-color: #fafafa;
  min-height: 92vh;
  border-radius: 0;
}

.box {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding: 10px 15px;
  min-height: 89vh;
}
</style>
