<template>
  <div class="footer">
    <div class="footer-item">
      <a href="http://www.devopsplus.com.cn/" target="_blank">Copyright&copy;2021 DevOps+</a>
    </div>
    <div class="footer-item">|</div>
    <div class="footer-item">
      <a href="https://github.com/zhanyeye/dingtalk-vue" target="_blank">GitHub</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
}
.footer-item {
  font-size: 14px;
  color: #595959;
  padding: 0 4px
}

</style>
