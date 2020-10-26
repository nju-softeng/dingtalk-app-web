<template>
  <div class="acinfo">
    <el-alert v-if="paper.result != 3 && paper.result != 4" title="论文投稿结果尚未确定，无AC变化显示" type="warning" />
    <div v-else class="ac">
      <el-form :label-position="top">
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 作者AC变化</span>
          <span v-for="(item, index) in paper.paperDetails" :key="index" style="padding:6px">{{ item.user.name }}:
            {{ item.ac }}</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿支持者AC</span>
          <span>
            <span v-if="paper.result == 4">+ 1 : </span>
            <span v-else>- 1 : </span>
          </span>
          <el-tag v-for="(item, index) in acceptlist" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿反对者AC</span>
          <span v-if="paper.result == 3">+ 1 : </span>
          <span v-else>- 1 : </span>
          <el-tag v-for="(item, index) in rejectlist" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getPaper, getVoteDetailByPid } from '@/api/paper'
export default {
  data() {
    return {
      id: null,
      paper: {},
      acceptlist: '',
      rejectlist: ''
    }
  },

  created() {
    // 获取路由的路径
    const path = this.$route.path
    if (path.slice(7, 16) === 'ex-detail') {
      // 如果是外部评审
      
    } else {
      // 如果是内部评审

    }
    this.id = this.$route.params.id
    getPaper(this.id).then(res => {
      this.paper = res.data
      console.log(this.paper)

      // todo 删除
      if (this.paper.result == 3 || this.paper.result == 4) {
        getVoteDetailByPid(this.id).then(res => {
          this.acceptlist = res.data.acceptnames
          this.rejectlist = res.data.rejectnames
        })
      }
    })
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.acinfo {
  background: #fff;
  min-height: 80vh;
  padding: 20px;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px 0;
}
</style>
