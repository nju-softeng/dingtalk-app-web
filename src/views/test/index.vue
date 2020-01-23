<template>
  <div>
    <div class="test">
      <el-card class="box-card" header="周报">
        <div v-for="o in 4" :key="o" class="text item">{{ data }}</div>
      </el-card>
    </div>
    <el-button></el-button>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.test >>> .el-card__header {
  padding: 10px 20px;
}

.text {
  font-size: 12px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  overflow: auto;
  height: 300px;
}

.test {
  width: 100%;
  height: 100px;
  margin: 4px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
