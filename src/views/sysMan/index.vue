<template>
  <div class="app-container">
    <div class="box">
      <el-row>
        <el-col :span="5">
          <div>
            <el-menu default-active="2" class="menu" @select="handleSelect">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
                </template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">参数设置</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col>
          <component v-bind:is="userMan"></component>
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
      activeName: "CN",
      createdTimes: 0
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    }
  },
  components: {
    userMan: () => import("./components/userMan"),
    confMan: () => import("./components/confMan")
  },
  created() {},
  methods: {
    handleSelect(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  width: 190px;
  min-height: 400px;
  /deep/ .el-submenu .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
    padding: 0 45px;
    min-width: 190px;
  }
}

// .box

.app-container {
  padding: 12px;
  background-color: #f5f5f5;
  min-height: 92vh;
  border-radius: 0;
}

.box {
  max-width: 1056px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding-top: 16px;
  padding-left: 0px;
  padding-right: 20px;
  min-height: 89vh;
}
</style>
