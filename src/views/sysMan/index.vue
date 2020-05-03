<template>
  <div class="app-container">
    <div class="box">
      <el-row>
        <el-col :sm="5" :md="4" :lg="4">
          <div>
            <el-menu default-active="userMan" class="menu" @select="handleSelect">
              <el-submenu>
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
                </template>
                <el-menu-item index="userMan">所有用户</el-menu-item>
                <!-- <el-menu-item index="userMan">选项2</el-menu-item> -->
              </el-submenu>
              <el-menu-item index="confMan">
                <i class="el-icon-menu"></i>
                <span slot="title">参数设置</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :sm="19" :md="20" :lg="20">
          <div>
            <component v-bind:is="activeName"></component>
          </div>
        </el-col>
      </el-row>
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
  width: 165px;
  min-height: 400px;
  /deep/ .el-submenu .el-menu-item,
  .el-submenu__title {
    min-width: 165px;
  }
  /deep/ .el-menu-item,
  .el-submenu__title {
    height: 50px;
    line-height: 50px;
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
  padding-top: 16px;
  padding-left: 0px;
  padding-right: 20px;
  min-height: 89vh;
}
</style>
