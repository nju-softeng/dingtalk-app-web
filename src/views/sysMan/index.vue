<template>
  <div class="app-container">
    <el-container class="box">
      <el-aside width="auto" style="background-color:#fff; padding:0px">
        <el-menu
          default-active="userMan"
          class="menu"
          @select="handleSelect"
          :collapse="device == 'mobile'"
        >
          <el-menu-item index="userMan">
            <i class="el-icon-user" />
            <span slot="title">用户管理</span>
          </el-menu-item>

          <el-menu-item index="confMan">
            <i class="el-icon-menu" />
            <span slot="title">参数设置</span>
          </el-menu-item>

          <el-menu-item index="scrollBoard">
            <i class="el-icon-data-board" />
            <span slot="title">编辑公告栏</span>
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
import { mapGetters } from "vuex";
export default {
  name: "Tab",
  components: {
    userMan: () => import("./components/userMan"),
    confMan: () => import("./components/confMan"),
    scrollBoard: () => import("./components/scrollBoard.vue"),
  },
  computed: {
    ...mapGetters(["device"]),
  },
  data() {
    return {
      activeName: "userMan",
    };
  },
  created() {},
  methods: {
    handleSelect(val) {
      this.activeName = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  // width: 170px;
  min-height: 550px;
  .el-menu {
    border-right: 1px solid #f0f0f0;
  }
  .el-submenu .el-menu-item,
  .el-submenu__title {
    min-width: 170px;
  }
  .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item.is-active {
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
  min-height: 80vh;
}

@media only screen and (min-width: 1400px) {
  .box {
    max-width: 1800px !important;
  }
}
</style>
