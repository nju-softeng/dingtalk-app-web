<template>
  <div>
    <ul class="tabs-nav" >
      <li v-for="(item, index) in navlist" :key="index" @click="toggle(index)" class="tab" :class="{selected:index==active}">{{item}}-{{index}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TabNav",
  model: {
    prop: 'active',
    event: 'toggle'
  },
  props:{
    active: {
      type: Number,
      default: 0
    },
    navlist: Array
  },
  methods: {
    toggle(index) {
      this.active = index;
      this.$emit('toggle', this.active)
    }
  }
};
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
}

.tabs-nav .tab:active {
  color: black;
  font-weight: bold;
  border-bottom: 2px solid #3e9bff;
}

.tabs-nav .tab:hover {
  color: black;
  font-weight: bold;
  border-bottom: 2px solid #3e9bff;
}
.tabs-nav .tab:after {
  color: black;
  border-bottom: 2px solid #3e9bff;
}
</style>
