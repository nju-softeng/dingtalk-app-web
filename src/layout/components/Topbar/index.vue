<template>
  <div style="display:flex">
    <div style="display:flex; justify-content: center; align-items: center;">
      <svg-icon icon-class="devops" style="margin-left:16px" />
    </div>

    <el-menu :default-active="activeMenu" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" mode="horizontal">
      <sidebar-item v-for="route in permission_routes" :key="route.index" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    }
  }
};
</script>
