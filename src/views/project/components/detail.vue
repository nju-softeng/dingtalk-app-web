<template>
  <div class="app-container">
    <el-page-header @back="goBack">
      <span slot="title" style="font-size:12.5px">
        返回
      </span>
      <span slot="content" style="font-size:12.5px">
        项目迭代
      </span>
    </el-page-header>

    <!-- <div>
      <el-table style="width: 100%">
        <el-table-column prop="address" label="迭代次序"> </el-table-column>
        <el-table-column prop="date" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="name" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="address" label="状态"> </el-table-column>
        <el-table-column prop="address" label="等级"> </el-table-column>
      </el-table>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  create() {},
  methods: {
    submit() {},
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
