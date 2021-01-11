<template>
  <div class="app-container">
    <el-container class="box">
      <el-aside width="170px" style="background-color:#fff; padding:0px">
        <el-menu default-active="userMan" class="menu" @select="handleSelect">
          <el-menu-item index="userMan">
            <i class="el-icon-user" />
            <span slot="title">用户管理</span>
          </el-menu-item>

          <el-menu-item index="confMan">
            <i class="el-icon-menu" />
            <span slot="title">参数设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding-top:0px">
        <component :is="activeName" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Tab',

  components: {
    userMan: () => import('./components/userMan'),
    confMan: () => import('./components/confMan')
  },
  data() {
    return {
      activeName: 'userMan'
    }
  },
  created() {},
  methods: {
    handleSelect(val) {
      this.activeName = val
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  width: 170px;
  min-height: 550px;
  /deep/ .el-menu {
    border-right: 1px solid #f0f0f0;
  }
  /deep/ .el-submenu .el-menu-item,
  .el-submenu__title {
    min-width: 170px;
  }
  /deep/ .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-menu-item.is-active {
    background-color: #e6f7ff;
    border-right: 2.5px #409eff solid;
  }
}

.app-container {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 0;
}

.box {
  max-width: 1172px;
  margin-left: auto;
  margin-right: auto;
  background: #fff;
  padding-top: 12px;
  min-height: 570px;
}

@media only screen and (min-width: 1400px) {
  .box  {
    max-width: 1305px !important;
  }
}

</style>
