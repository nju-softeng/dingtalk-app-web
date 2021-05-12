<template>
  <div>
    <div class="wrap-head">
      <div class="layout-container">
        <div class="groupInfo">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:13px">
            <el-breadcrumb-item :to="{ path: '/paper/index/external' }"> <svg-icon icon-class="back" />  <span style="color: #409EFF">返回列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>论文详情</el-breadcrumb-item>
          </el-breadcrumb>

          <div style="padding-left: 16px; padding-right: 16px">
            <p style="margin-bottom:0px">
              <span style="font-size:18px;color:#0366d6;font-weight: 500;">
                {{ paper.title }}</span>
            </p>

            <div style="display:flex;flex-wrap: wrap">
              <div style="font-size:13px;color:#595959;">
                <p>
                  <span style="margin-right:8px">
                    <svg-icon icon-class="vote" /> 投票意见:
                  </span>
                  <el-tag :type="getVoteResult(paper.vote).type">{{
                    getVoteResult(paper.vote).content
                  }}</el-tag>
                </p>
              </div>
            </div>
          </div>
        </div>
        <el-menu :default-active="activeTab" mode="horizontal" @select="handleSelect">
          <el-menu-item index="vote">投票</el-menu-item>
          <el-menu-item index="review">评审意见</el-menu-item>
          <el-menu-item index="acinfo">AC 变更</el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="container">
      <component :is="activeTab" :paperid="id" />
    </div>
  </div>
</template>
<script>
import { getExPaper } from '@/api/ex-paper'

export default {
  components: {
    review: () => import('./components/review'),
    vote: () => import('./components/vote'),
    acinfo: () => import('./components/acinfo')
  },
  data() {
    return {
      id: null,
      paper: {},
      activeTab: 'vote'
    }
  },
  computed: {
    // 投票状态标签
    getVoteResult() {
      return vote => {
        if (vote === undefined) {
          return {
            type: 'info',
            content: '投票未发起'
          }
        } else if (vote.result === undefined) {
          return {
            type: '',
            content: '等待投票结果'
          }
        } else if (vote.result === true) {
          return {
            type: 'success',
            content: 'ACCEPT'
          }
        } else if (vote.result === false) {
          return {
            type: 'danger',
            content: 'REJECT'
          }
        }
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.activeTab = this.$route.params.tab || 'vote'
    getExPaper(this.id)
      .then(res => {
        this.paper = res.data
        console.log(this.paper)
      })
      .catch(() => {
        this.$router.push({ path: '/404' })
      })
  },
  methods: {
    handleSelect(val) {
      this.activeTab = val
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-head {
  padding-top: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.layout-container {
  max-width: 1256px;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
}

.container {
  padding: 12px;
  background-color: #fafafa;
}

.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.el-menu.el-menu--horizontal {
  border-bottom: 0px;
}

.box {
  min-height: 80vh;
  overflow: auto;
  border-radius: 2px;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px 20px 0;
}

@media only screen and (max-width: 855px) {
  .container {
    padding: 0px;
  }
}

</style>
