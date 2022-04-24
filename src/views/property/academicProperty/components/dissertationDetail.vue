<template>
  <div>
    <div class="wrap-head">
      <div class="layout-container">
        <div class="dissertationInfo">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:13px">
            <el-breadcrumb-item :to="{ path: '/property/academic/studentDissertation' }"> <svg-icon icon-class="back" />  <span style="color: #409EFF">返回列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>毕业论文详情</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="padding-left: 16px; padding-right: 16px">
            <p style="margin:30px auto 0 auto">
              <span style="font-size:20px;color:#0366d6;font-weight: 500;">
                {{ dissertation.user.name }}</span>
            </p>
            <div style="display:flex;flex-wrap: wrap">
              <div style="font-size:13px;color:#595959;">
                <p>
                  <span style="margin-right:8px">
                    <i class="el-icon-finished" /> 毕业年份:
                  </span>
                  <el-tag>{{ dissertation.graduateYear }}年</el-tag>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dissertationFiles">
      <div class="files">
        <el-timeline>
          <file-card
            v-for="item in cards"
            :key="item.index"
            :card="item"
            :dissertation-uid="dissertationUid"
            :file-path="dissertation.filePath"
            :dissertation-id="dissertation.id"
            @init="init"
          />
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { getDissertationDetail } from '@/api/dissertation'
import fileCard from './fileCard'
export default {
  name: 'DissertationDetail',
  components: { fileCard },
  data() {
    return {
      dissertationUid: -1,
      uid: -1,
      dissertation: {
        id: -1,
        user: {},
        state: 0
      },
      cards: [
        { fileName: '', fileId: '', fileTypeZHCN: '预答辩文件', fileType: 'preRejoinFile', fileShow: true },
        { fileName: '', fileId: '', fileTypeZHCN: '送审文件', fileType: 'reviewFile', fileShow: false },
        { fileName: '', fileId: '', fileTypeZHCN: '最终答辩文件', fileType: 'rejoinFile', fileShow: false },
        { fileName: '', fileId: '', fileTypeZHCN: '最终版本', fileType: 'finalFile', fileShow: false }
      ]
    }
  },
  created() {
    this.dissertationUid = parseInt(this.$route.params.id)
    this.uid = sessionStorage.getItem('uid')
    this.init()
  },
  methods: {
    init() {
      getDissertationDetail(this.dissertationUid).then(res => {
        if (res) {
          this.dissertation = res.data
          this.cards[0].fileName = res.data.preRejoinFileName
          this.cards[0].fileId = res.data.preRejoinFileId
          this.cards[1].fileName = res.data.reviewFileName
          this.cards[1].fileId = res.data.reviewFileId
          this.cards[2].fileName = res.data.rejoinFileName
          this.cards[2].fileId = res.data.rejoinFileId
          this.cards[3].fileName = res.data.finalFileName
          this.cards[3].fileId = res.data.finalFileId
          let judge = true
          for (var i = 1; i < 4; i++) {
            if (this.cards[i - 1].fileName != null && judge) {
              this.cards[i].fileShow = true
            } else {
              this.cards[i].fileShow = false
              judge = false
            }
          }
        }
      }).catch(err => {
        this.$message.error('获取论文信息失败！')
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .wrap-head {
    padding-top: 16px;
    background-color: #fff;
    border-bottom: 1px solid #e8e8e8;
  }

  .layout-container {
    max-width: 1256px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
  }

  .files {
    min-height: calc(100vh - 280px);
    max-width: 1256px;
    margin-left: auto;
    margin-right: auto;
    padding: 10px 20px 0;
  }
</style>
