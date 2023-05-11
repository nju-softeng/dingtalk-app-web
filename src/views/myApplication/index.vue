<template>
  <div class="app-container">
    <el-container class="box">
      <el-aside width="auto" style="background-color:#fff; padding:0px">
        <el-menu
          :default-active="activeName"
          class="menu"
          @select="handleSelect"
          :collapse="device == 'mobile'"
        >
          <el-menu-item index="myPatentApply">
            <i class="el-icon-files" />
            <span slot="title">专利申请</span>
          </el-menu-item>

          <el-menu-item index="myReimburseApply">
            <i class="el-icon-money" />
            <span slot="title">报销申请</span>
          </el-menu-item>

          <el-menu-item index="myInternshipApply">
            <i class="el-icon-suitcase" />
            <span slot="title">实习申请</span>
          </el-menu-item>

          <el-menu-item index="myVMApply">
            <i class="el-icon-monitor" />
            <span slot="title">虚拟机申请</span>
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
  name: "myApplication",
  components: {
    myInternshipApply: () => import("./subViews/myInternshipApply"),
    myPatentApply: () => import("./subViews/myPatentApply"),
    myVMApply: () => import("./subViews/myVMApply"),
    myReimburseApply: () => import("./subViews/myReimburseApply"),
  },
  computed: {
    ...mapGetters(["device"]),
  },
  data() {
    return {
      activeName:
        sessionStorage.getItem("myAppicationActiveName") || "myVMApply",
    };
  },
  created() {},
  methods: {
    handleSelect(val) {
      sessionStorage.setItem("myAppicationActiveName", val);
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
  //   background-color: #fafafa;
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
