<template>
  <div>
    <ul class="tabs-nav" @toggle="toggle">
      <li class="tab" :class="[active === 0 ? 'showActive' : '']">内部评审</li>
      <li class="tab" :class="[active === 1 ? 'showActive' : '']">外部评审</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TabNav",
  data() {
    return {
      active: 0
    };
  },
  methods: {
    toggle(tab) {
      console.log(tab.index)
      this.active = tab.index;
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

.showActive {
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
