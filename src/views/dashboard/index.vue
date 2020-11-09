<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import auditorDashboard from './auditor'
import studentDashboard from './student'
export default {
  name: 'Dashboard',
  components: { auditorDashboard, studentDashboard },
  data() {
    return {
      currentRole: 'studentDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    if (!this.roles.includes('normal')) {
      this.currentRole = 'auditorDashboard'
    }
  },
  mounted() {
    // let windowWidth = document.body.clientWidth;
    // if (windowWidth > 700 && windowWidth < 1024) {
    //   this.$notify({
    //     title: "小提示",
    //     message: "建议点击右上角的'独立窗口', 调整宽度，以提升使用体验",
    //     position: "bottom-right"
    //   });
    // }
  }
}
</script>
