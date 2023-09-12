<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeMenu"
      :text-color="variables.menuText"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <bar-item
        v-for="route in permission_routes"
        :key="route.index"
        :item="route"
        :base-path="route.path"
        menu-item-width="170"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import BarItem from './Topbar/BarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { BarItem },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    }
  },
  methods: {

  }
}
</script>
