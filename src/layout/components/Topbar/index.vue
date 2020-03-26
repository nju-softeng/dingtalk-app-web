<template>
  <div class="menu" style="display:flex">
    <div @click="go" class="logo" style="display:flex; justify-content: center; align-items: center;margin-left:16px;margin-right:16px;">
      <svg-icon icon-class="devops" style="margin:0 8px;" />
      <div style="font-size:12.5px">DevOps+</div>
    </div>

    <el-menu :default-active="activeMenu" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" mode="horizontal">
      <topbar-item v-for="route in permission_routes" :key="route.index" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopbarItem from "./TopbarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { TopbarItem },
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
  },
  methods: {
    go() {
      this.$router.push({
        path: "/"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.logo:hover {
  cursor: pointer;
}
</style>
