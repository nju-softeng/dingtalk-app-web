<template>
  <div>
    <div class="wrap-head">
      <div class="layout-container">
        <div class="groupInfo">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:13px;width: 100%">
            <el-breadcrumb-item :to="{ path: '/paper/index/internal' }"> <svg-icon icon-class="back" />  <span style="color: #409EFF">返回列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>论文详情</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="display: flex">
            <div style="float:left;padding-left: 16px; padding-right: 16px">
              <p style="margin-bottom:0">
                <span style="font-size:18px;color:#0366d6;font-weight: 500;">
                  {{ paper.title }}</span>
              </p>

              <div style="display:flex;flex-wrap: wrap">
                <div style="font-size:13px;color:#595959; margin-right:48px">
                  <p>
                    <svg-icon icon-class="school" />
                    <span style="margin-right:8px">
                      机构：{{ paper.journal }}</span>
                    <el-tag>{{ getlevel(paper.paperType) }}</el-tag>
                  </p>
                  <p>
                    <span>
                      <svg-icon icon-class="people" /> 作者: </span>
                    <span
                      v-for="(p, index) in paper.paperDetails"
                      :key="index"
                      style="margin:6px"
                    >{{ p.user.name }}</span>
                  </p>
                </div>

                <div style="font-size:13px;color:#595959;">
                  <p>
                    <span style="margin-right:8px">
                      <svg-icon icon-class="vote" /> 投票意见:
                    </span>
                    <el-tag :type="getVoteResult(paper.vote).type ">{{
                      getVoteResult(paper.vote).content
                    }}</el-tag>
                  </p>
                  <p>
                    <span style="margin-right:8px">
                      <svg-icon icon-class="paper" /> 投稿结果:
                    </span>
                    <el-tag :type="getPaperResult(paper).type ">{{
                      getPaperResult(paper).content
                    }}</el-tag>
                  </p>
                </div>
              </div>
            </div>
            <el-divider v-if="isAbleToMakeFlatDecision" direction="vertical" style="float: left;height: 200px" />
            <div v-if="isAbleToMakeFlatDecision" style="margin-left: 50px;float: left">
              <el-row type="flex" justify="center">
                <p style="margin-bottom:20px">
                  <span style="font-size:15px;color:#ff0000;font-weight: 500;">
                    当前论文投票结果为平票，请选择是否外投或中止
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="外投或中止仍会影响ac值，请谨慎选择"
                      placement="right"
                    >
                      <span style="margin-left: 0px">
                        <svg-icon
                          style="color: red"
                          icon-class="hint"
                        /></span>
                    </el-tooltip>
                  </span>
                </p>
              </el-row>
              <el-row type="flex" justify="center">
                <el-button type="primary" size="large" round @click="decideFlat(true)">外投</el-button>
                <el-button type="danger" size="large" round @click="decideFlat(false)">中止</el-button>
              </el-row>

            </div>
          </div>
        </div>
        <el-menu :default-active="activeTab" mode="horizontal" @select="handleSelect">
          <el-menu-item index="vote">投票</el-menu-item>
          <el-menu-item index="review">评审意见</el-menu-item>
          <el-menu-item index="acinfo">AC 变更</el-menu-item>
          <el-menu-item index="files">论文文件</el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="container">
      <component :is="activeTab" :paperid="id" :paper-type="0" :paper-path="paper.path" />
    </div>
  </div>
</template>
<script>
import { getPaper, makeFlatDecision } from '@/api/paper'

const levels = [
  {
    value: 'JOURNAL_A',
    label: 'Journal A'
  },
  {
    value: 'CONFERENCE_A',
    label: 'Conference A'
  },
  {
    value: 'JOURNAL_B',
    label: 'Journal B'
  },
  {
    value: 'CONFERENCE_B',
    label: 'Conference B'
  },
  {
    value: 'JOURNAL_C',
    label: 'Journal C'
  },
  {
    value: 'CONFERENCE_C',
    label: 'Conference C'
  },
  {
    value: 'Non_CCF',
    label: 'Non_CCF'
  }
]

export default {
  components: {
    review: () => import('./components/review'),
    vote: () => import('./components/vote'),
    acinfo: () => import('./components/acinfo'),
    files: () => import('./components/files')
  },
  data() {
    return {
      level: levels,
      id: null,
      paper: {},
      activeTab: 'vote',
      flatDecisionForm: {
        id: null,
        decision: null
      }
    }
  },
  computed: {
    getlevel() {
      return val => {
        const tmp = this.level.find(item => item.value === val)
        if (tmp !== undefined) {
          return tmp.label
        }
      }
    },
    // 投票状态标签
    getVoteResult() {
      return vote => {
        if (vote === undefined) {
          return {
            type: 'info',
            content: '投票未发起'
          }
        } else if (vote.result === -1) {
          return {
            type: 'info',
            content: '等待投票结果'
          }
        } else if (vote.result === 1) {
          return {
            type: 'success',
            content: 'ACCEPT'
          }
        } else if (vote.result === 0) {
          return {
            type: 'danger',
            content: 'REJECT'
          }
        } else if (vote.result === 2) {
          return {
            type: 'info',
            content: 'FLAT'
          }
        } else {
          return {
            type: 'danger',
            content: '未知的状态'
          }
        }
      }
    },
    // 论文状态标签
    getPaperResult() {
      return paper => {
        if (paper.result === 0) {
          return {
            type: 'info',
            content: '等待内审中'
          }
        } else if (paper.result === 1) {
          return {
            type: 'info',
            content: '内审未通过'
          }
        } else if (paper.result === 2) {
          return {
            type: 'info',
            content: '等待中'
          }
        } else if (paper.result === 3) {
          return {
            type: 'danger',
            content: 'REJECT'
          }
        } else if (paper.result === 4) {
          return {
            type: 'success',
            content: 'ACCEPT'
          }
        } else if (paper.result === 5) {
          return {
            type: 'info',
            content: 'FLAT'
          }
        } else if (paper.result === 6) {
          return {
            type: 'info',
            content: 'SUSPEND'
          }
        } else {
          return {
            type: 'info',
            content: 'null'
          }
        }
      }
    },
    // 是否可以决定平票结果
    isAbleToMakeFlatDecision() {
      if (this.paper.result === 5) {
        const uid = sessionStorage.getItem('uid')
        // console.log('uid', uid)
        for (let i = 0; i < this.paper.paperDetails.length; i++) {
          if (uid === this.paper.paperDetails[i].user.id.toString()) {
            return true
          }
        }
      }
      return false
    }
  },
  created() {
    this.id = this.$route.params.id
    this.activeTab = this.$route.params.tab || 'vote'
    getPaper(this.id)
      .then(res => {
        this.paper = res.data
        console.log('paper', this.paper)
      })
      .catch(() => {
        this.$router.push({ path: '/404' })
      })
  },
  methods: {
    handleSelect(val) {
      this.activeTab = val
    },
    decideFlat(val) {
      this.flatDecisionForm.id = this.id
      this.flatDecisionForm.decision = val
      makeFlatDecision(this.id, this.flatDecisionForm).then(() => {
        if (val) {
          this.$message({
            type: 'success',
            message: '已决定外投！'
          })
        } else {
          this.$message({
            type: 'success',
            message: '已中止评审！'
          })
        }
        getPaper(this.id)
          .then(res => {
            this.paper = res.data
            // console.log(this.paper)
          })
          .catch(() => {
            this.$router.push({ path: '/404' })
          })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '连接超时！'
        })
      })
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
  border-bottom: 0;
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
    padding: 0;
  }
}
.el-divider--vertical {
  height: 100px;
}

</style>
