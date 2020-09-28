<template>
  <!--tabs容器-->
  <div>
    {{value}}
    <!--标签页容器-->
    <div class="tabs-nav">
      <!--标签页头label-->
      <div class="tab" v-for="(item, index) in navList"  @click="handleChange(index)" :class="{selected:item.name==actived}" :key="index">
        {{ item.label }}
      </div>
    </div>
    <!--所有pane组件使用的slot容器-->
    <div class="pane-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    value: {
      type: [String, Number]
    }
  },
  model: {
    prop: 'value',
    event: 'handleChange'
  },
  data() {
    return {
      navList: [],
      actived: this.value
    };
  },
  provide() {
    return {TabsInstance: this}
  },
  watch: {
    value(val) {
      this.actived = val
    },
  },
  methods: {
    //改变activeKey，并监听activeKey重新更新显示状态
    handleChange(index) {
      console.log(index)
      const nav = this.navList[index]
      this.actived = nav.name
      console.log()
    },
    //初始化更新
    initTabs() {
      this.updateNav()
    },
    //获取tabs下的所有pane实例
    getTabs() {
      return this.$children.filter(item => item.$options.name === 'TabPane')
    },
    //获取所有pane组件用户传入的props
    updateNav() {
      this.navList = []
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          label: pane.label,
          name: pane.name || index
        })
        //如果不传value,默认选中第一项
        if (index === 0 && !this.activeKey) {
          this.actived = pane.name
        }
      })
    }
  }
}
</script>

<style scoped>
.tabs-nav {
  margin-right: 32px;
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
