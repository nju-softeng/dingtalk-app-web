<template>
  <div class="tabs-nav">
    <!--标签页头label-->
    <div
      v-for="(item, index) in navList"
      :key="index"
      class="tab"
      :class="{ selected: item.name === actived }"
      @click="handleChange(index)"
    >
      {{ item.label }}
    </div>
    <!--所有pane组件使用的slot容器-->
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  provide() {
    return { TabsInstance: this }
  },
  model: {
    prop: 'actived',
    event: 'handleChange'
  },
  props: ['actived'],
  data() {
    return {
      navList: []
    }
  },
  watch: {
    actived() {
      // 通知父组件 actived 值被更新
      this.$emit('handleChange', this.actived)
    }
  },
  methods: {
    // 改变activeKey，并监听activeKey重新更新显示状态
    handleChange(index) {
      const nav = this.navList[index]
      this.actived = nav.name
    },
    // 初始化更新
    initTabs() {
      // 获取所有pane组件用户传入的props
      this.navList = []
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          label: pane.label,
          name: pane.name || index
        })
        // 如果不传value,默认选中第一项
        if (index === 0 && !this.actived) {
          this.actived = pane.name
        }
      })
    },
    // 获取tabs下的所有pane实例
    getTabs() {
      return this.$children.filter(item => item.$options.name === 'TabPane')
    }
  }
}
</script>

<style scoped>
.tabs-nav {
  padding: 6px 0;
  color: #666;
  font-size: 12px;
  background-color: transparent;
}
.tabs-nav .tab {
  display: inline-block;
  cursor: pointer;
  margin: 0 14px;
  padding: 7px 1px;
}

.selected {
  color: black;
  font-weight: bold;
  border-bottom: 2px solid #3e9bff;
  transition: transform 300ms ease-in-out;
}

.tabs-nav .tab:active {
  color: black;
  font-weight: bold;
  border-bottom: 2px solid #3e9bff;
  transition: transform 300ms ease-in-out;
}
</style>
