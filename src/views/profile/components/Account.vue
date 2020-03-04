<template>
  <div></div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: ""
        };
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: "User information has been updated successfully",
        type: "success",
        duration: 5 * 1000
      });
    }
  }
};
</script>
