<template>
  <div class="app-container">
    <el-tabs v-model="activetab" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="first">
        <span slot="label"><i class="el-icon-s-claim"></i> 待审核</span>
        <div style="height:74vh">
          <checking v-if="firstTab" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审核" name="second" lazy>
        <div style="height:74vh">
          <checked v-if="secondTab" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activetab: "first",
      firstTab: true,
      secondTab: false
    };
  },
  components: {
    checking: () => import("./components/checking"),
    checked: () => import("./components/checked")
  },
  methods: {
    handleClick(tab) {
      if (tab.name === "first") {
        this.firstTab = true;
        this.secondTab = false;
      } else if (tab.name === "second") {
        this.firstTab = false;
        this.secondTab = true;
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  padding-top: 10px;
}
</style>
