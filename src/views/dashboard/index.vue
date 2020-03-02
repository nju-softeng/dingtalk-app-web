<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import auditorDashboard from "./auditor";
import studentDashboard from "./student";
export default {
  name: "Dashboard",
  components: { auditorDashboard, studentDashboard },
  data() {
    return {
      currentRole: "studentDashboard"
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    console.log(this.roles + "lllllg");
    if (!this.roles.includes("postgraduate")) {
      this.currentRole = "auditorDashboard";
    }
  }
};
</script>
