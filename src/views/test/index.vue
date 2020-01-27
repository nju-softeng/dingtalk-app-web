<template>
  <div id="parent">
    <div id="top">top content no need of scroll</div>
    <div id="bottom">I need scroll here when this content overflow the parent.</div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#parent {
  height: 1000px;
  width: 100%;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
}

#top {
  background-color: #ccc;
  width: 100%;
  height: auto;
}

#bottom {
  height: auto;
  width: 100%;
  background-color: grey;
  overflow-y: auto;
  flex: 1;
}

.father {
  position: relative;
  height: 10000px;
  border: 1px;
}

.text {
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
