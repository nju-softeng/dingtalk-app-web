<template>
  <div class="acinfo">
    <div v-if="showContent" class="ac">
      <el-form>
        <el-form-item v-if="isExternal === false">
          <span slot="label">
            <svg-icon icon-class="paper" /> 作者AC变化</span>
          <span v-for="(item, index) in internalPaper.paperDetails" :key="index" style="padding:6px">{{ item.user.name }}:
            {{ item.ac }}</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿支持者：</span>
<!--          <span>-->
<!--            <span v-if="internalPaper.result == 4">+ 1 : </span>-->
<!--            <span v-else>- 1 : </span>-->
<!--          </span>-->
          <el-tag v-for="(item, index) in acceptlist" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <svg-icon icon-class="paper" /> 投稿反对者：</span>
<!--          <span v-if="internalPaper.result == 3">+ 1 : </span>-->
<!--          <span v-else>- 1 : </span>-->
          <el-tag v-for="(item, index) in rejectlist" :key="index" style="margin:0px 4px;">{{ item }}</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <el-alert v-else title="论文投稿结果尚未确定，无AC变化显示" type="warning" />
  </div>
</template>
<script>
import { getPaper, getVoteDetailByVid } from '@/api/paper'
import { getExPaper } from '@/api/ex-paper'

export default {
  data() {
    return {
      id: null,
      showContent: false,
      isExternal: null,
      internalPaper: {},
      externalPaper: {},
      acceptlist: '',
      rejectlist: ''
    }
  },

  created() {
    this.id = this.$route.params.id
    // 获取路由的路径
    const path = this.$route.path
    if (path.slice(7, 16) === 'in-detail') {
      // 如果是内部评审, 获取内部论文的信息
      getPaper(this.id).then(res => {
        this.internalPaper = res.data
        console.log(this.internalPaper)
        if (this.internalPaper.result === 3 || this.internalPaper.result === 4) {
          // 论用结果已经产生,获取投票的名单详情
          getVoteDetailByVid(this.internalPaper.vote.id).then(res => {
            this.acceptlist = res.data.acceptnames
            this.rejectlist = res.data.rejectnames
          })
          // 显示ac内容
          this.showContent = true
        } else {
          this.showContent = false
        }
        this.isExternal = false
      })
    } else {
      // 如果是外部评审，获取外部论文信息
      getExPaper(this.id).then(res => {
        this.externalPaper = res.data
        if (this.externalPaper.result === true) {
          // 论用结果已经产生,获取投票的名单详情
          getVoteDetailByVid(this.externalPaper.vote.id).then(res => {
            this.acceptlist = res.data.acceptnames
            this.rejectlist = res.data.rejectnames
          })
          this.showContent = true
        } else {
          this.showContent = false
        }

        console.log(this.externalPaper)
      })
      this.isExternal = true
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.acinfo {
  background: #fff;
  min-height: calc(100vh - 280px);
  padding: 20px;
  max-width: 1256px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px 0;
}
</style>
