<template>
  <div class="acinfo">
    <el-alert v-if="paper.result == undefined" title="论文投稿结果尚未确定，无AC变化显示" type="warning">
    </el-alert>
    <div class="ac" v-else>
      <el-form :label-position="top">
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 作者AC变化</span>
          <span style="padding:6px" v-for="(item, index) in paper.paperDetails" :key="index">{{ item.user.name }}: {{ item.ac }}</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿支持者AC</span>
          <span>
            <span v-if="paper.result == true">+ 1</span>
            <span v-else>- 1</span>
          </span>
          <el-tag style="margin:0px 4px;" v-for="(item, index) in acceptlist" :key="index">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿反对者AC</span>
          <span v-if="paper.result == false"> + 1</span>
          <span v-else> - 1</span>
          <el-tag style="margin:0px 4px;" v-for="(item, index) in rejectlist" :key="index">{{ item }}</el-tag>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getPaper, getVoteDetail } from "@/api/paper";
export default {
  data() {
    return {
      id: null,
      paper: {},
      acceptlist: "",
      rejectlist: ""
    };
  },

  created() {
    this.id = this.$route.params.id;
    getPaper(this.id).then(res => {
      this.paper = res.data;

      // todo 删除
      if (this.paper.result != undefined) {
        getVoteDetail(this.id).then(res => {
          this.acceptlist = res.data.acceptnames;
          this.rejectlist = res.data.rejectnames;
        });
      }
    });
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.acinfo {
  background: #fff;
  min-height: 50vh;
  padding: 20px;
}
</style>
