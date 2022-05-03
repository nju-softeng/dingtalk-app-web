<template>
  <div>
    <div class="wrap-head">
      <div class="layout-container">
        <div class="groupInfo">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:13px;width: 100%">
            <el-breadcrumb-item :to="{ path: '/patent/index/' }"> <svg-icon icon-class="back" />  <span style="color: #409EFF">返回列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>专利详情</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="display: flex">
            <div style="float:left;padding-left: 16px; padding-right: 16px">
              <p style="margin-bottom:0">
                <span style="font-size:18px;color:#0366d6;font-weight: 500;">
                  {{ patent.name }}</span>
              </p>
              <div style="display:flex;flex-wrap: wrap">
                <div style="font-size:13px;color:#595959; margin-right:48px">
                  <p>
                    <i class="el-icon-house" />
                    <span style="margin-right:8px">
                      权利人：{{ patent.obligee }}</span>
                    <el-tag>{{ patent.type }}</el-tag>
                  </p>
                  <p>
                    <span>
                      <svg-icon icon-class="people" /> 发明人: </span>
                    <span
                      v-for="(p, index) in patent.patentDetailList"
                      :key="index"
                      style="margin:6px"
                    >{{ p.user.name }}</span>
                  </p>
                </div>
                <div style="font-size:13px;color:#595959;margin-right: 20px">
                  <p>
                    <span style="margin-right:8px">
                      <svg-icon icon-class="vote" /> 专利状态:
                    </span>
                    <el-tag :type="getState(patent.state).type">{{
                      getState(patent.state).content
                    }}</el-tag>
                  </p>
                </div>
                <div style="font-size:13px;color:#595959;">
                  <p>
                    <span style="margin-right:8px">
                      <i class="el-icon-date" /> 年份:
                    </span>
                    <el-tag type="info">{{
                      patent.year
                    }} 年</el-tag>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="files">
      <el-timeline>
        <file-card
          v-for="item in cards"
          :key="item.index"
          :card="item"
          :patent-id="id"
          :patent-path="patent.filePath"
          @init="init"
        />
      </el-timeline>
    </div>
  </div>
</template>

<script>
import fileCard from './fileCard'
import { getPatentDetail } from '@/api/patent'
export default {
  name: 'PatentDetail',
  components: { fileCard },
  data() {
    return {
      id: null,
      patent: {
        state: 0
      },
      cards: [
        { fileName: '', fileId: '', fileTypeZHCN: '专利内审文件', fileType: 'reviewFile', fileShow: true },
        { fileName: '', fileId: '', fileTypeZHCN: '专利提交文件', fileType: 'submissionFile', fileShow: false },
        { fileName: '', fileId: '', fileTypeZHCN: '专利评论文件', fileType: 'commentFile', fileShow: false },
        { fileName: '', fileId: '', fileTypeZHCN: '受理文件名', fileType: 'handlingFile', fileShow: false },
        { fileName: '', fileId: '', fileTypeZHCN: '授权文件名', fileType: 'authorizationFile', fileShow: false }
      ]
    }
  },
  computed: {
    getState() {
      return state => {
        if (state === 0) {
          return {
            type: 'info',
            content: '等待内审'
          }
        } else if (state === 1) {
          return {
            type: 'danger',
            content: '内审不通过'
          }
        } else if (state === 2) {
          return {
            type: 'success',
            content: '内审通过'
          }
        } else if (state === 3) {
          return {
            type: 'success',
            content: '专利授权'
          }
        } else if (state === 4) {
          return {
            type: 'danger',
            content: '专利驳回'
          }
        }
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.init()
  },
  methods: {
    init() {
      getPatentDetail(this.id).then(res => {
        this.patent = res.data
        console.log(this.patent)
        this.handleRes(res)
      }).catch(err => {
        this.$message.error('无法获取专利信息！')
        console.log(err)
      })
    },
    handleRes(res) {
      this.cards[0].fileName = res.data.reviewFileName
      this.cards[0].fileId = res.data.reviewFileId
      this.cards[1].fileName = res.data.submissionFileName
      this.cards[1].fileId = res.data.submissionFileId
      this.cards[2].fileName = res.data.commentFileName
      this.cards[2].fileId = res.data.commentFileId
      this.cards[3].fileName = res.data.handlingFileName
      this.cards[3].fileId = res.data.handlingFileId
      this.cards[4].fileName = res.data.authorizationFileName
      this.cards[4].fileId = res.data.authorizationFileId
      let judge = true
      for (var i = 1; i < 5; i++) {
        if (this.cards[i - 1].fileName != null && judge) {
          this.cards[i].fileShow = true
        } else {
          this.cards[i].fileShow = false
          judge = false
        }
      }
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

  .files {
    min-height: calc(100vh - 280px);
    max-width: 1256px;
    margin-left: auto;
    margin-right: auto;
    padding: 10px 20px 0;
  }
</style>
