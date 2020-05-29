<template>
  <div class="app-container">
    <div class="box">
      <el-container>
        <el-aside width="175px" style="background-color:#fff; padding:0px">
          <el-menu default-active="userMan" class="menu" @select="handleSelect">
            <el-menu-item index="userMan">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>

            <el-menu-item index="confMan">
              <i class="el-icon-menu"></i>
              <span slot="title">参数设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="padding-top:0px">
          <div>
            <component v-bind:is="activeName"></component>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tab",
  data() {
    return {
      activeName: "userMan"
    };
  },

  components: {
    userMan: () => import("./components/userMan"),
    confMan: () => import("./components/confMan")
  },
  created() {},
  methods: {
    handleSelect(val) {
      this.activeName = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  width: 175px;
  min-height: 400px;
  /deep/ .el-menu {
    border-right: 1px solid #f0f0f0;
  }
  /deep/ .el-submenu .el-menu-item,
  .el-submenu__title {
    min-width: 175px;
  }
  /deep/ .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 34px;
  }
  /deep/ .el-menu-item.is-active {
    background-color: #e6f7ff;
    border-right: 2px #409eff solid;
  }
}

.app-container {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 92vh;
  border-radius: 0;
}

.box {
  max-width: 1072px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding-top: 12px;
  min-height: 89vh;
}
</style>
