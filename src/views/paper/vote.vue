<template>
  <div class="app-container">
    <el-page-header @back="goBack"> </el-page-header>

    <div style="margin-top:20px; margin-left:10px">
      <el-form>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 论文名称</span>
          {{ paper.title }}
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="school" /> 投稿地点</span>
          {{ paper.journal }}
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="grade" /> 论文分类</span>
          {{ paper.level }}
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="people" /> 论文作者 </span>
          <span style="margin:10px" v-for="p in paper.paperDetails" :key="p.index">{{ p.user.name }}</span>
        </el-form-item>
      </el-form>
    </div>

    {{ paper }}
  </div>
</template>
<script>
import { getPaper } from "@/api/paper";

export default {
  data() {
    return {
      id: null,
      paper: {}
    };
  },
  created() {
    this.id = this.$route.params.id;
    getPaper(this.id).then(res => {
      this.paper = res.data;
    });
    console.log(this.$route.params.id);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
