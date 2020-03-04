<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    console.log(window.location.href);
  }
};
</script>

<style>
::-webkit-scrollbar {
  width: 7px;
}
/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}
</style>
