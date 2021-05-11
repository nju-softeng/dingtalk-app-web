<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <div class="footer">
      <div class="footer-item">
        <a href="http://www.devopsplus.com.cn/" target="_blank">Copyright&copy;2021 DevOps+</a>
      </div>
      <div class="footer-item">|</div>
      <div class="footer-item">
        <a href="https://github.com/zhanyeye/dingtalk-vue" target="_blank">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>

.footer {
  margin-top: 20px;
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

.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 48px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 48px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
