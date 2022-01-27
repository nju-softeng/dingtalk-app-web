<template>
  <div />
</template>
<script>
export default {
  name: "TabPane",
  inject: ["TabsInstance"],
  props: {
    name: {
      type: String,
    },
    label: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.TabsInstance.initTabs();
  },
};
</script>
