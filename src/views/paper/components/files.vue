<template>
  <div class="files">
    <el-timeline v-if="paperType !== 2">
      <file-card
        v-for="item in cards"
        :key="item.index"
        :card="item"
        :paper-id="id"
        :paper-type="paperType"
        :paper-path="paperPath"
        @init="init"
      />
    </el-timeline>
    <el-timeline v-else>
      <file-card
        v-for="item in cards.slice(1)"
        :key="item.index"
        :card="item"
        :paper-id="id"
        :paper-type="paperType"
        :paper-path="paperPath"
        @init="init"
      />
    </el-timeline>
  </div>
</template>

<script>
import { getPaperFileInfo, getExternalPaperFileInfo } from '@/api/paperFile'
import fileCard from './fileCard'

export default {
  components: { fileCard },
  props: {
    paperType: {
      type: Number,
      default: -1 // -1为默认值，0为内部评审论文，1为外部论文，2为非学生一作论文
    },
    paperPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cards: [
        { fileName: '', fileId: '', fileTypeZHCN: '评审版本文件', fileType: 'reviewFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '提交时文件', fileType: 'submissionFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '文献评审结果', fileType: 'commentFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '发表版本文件', fileType: 'publishedFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '发表版本LATEX文件', fileType: 'publishedLatexFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '源文件', fileType: 'sourceFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '对外版本文件', fileType: 'publicFile' }
      ]
    }
  },
  created() {
    // console.log(this.paperType)
    this.id = this.$route.params.id
    this.init()
  },
  methods: {
    init() {
      if (this.paperType === 0 || this.paperType === 2) {
        getPaperFileInfo(sessionStorage.getItem('uid'), this.id).then(res => {
          this.cards[0].fileName = res.data.reviewFileName
          this.cards[0].fileId = res.data.reviewFileId
          this.cards[1].fileName = res.data.submissionFileName
          this.cards[1].fileId = res.data.submissionFileId
          this.cards[2].fileName = res.data.commentFileName
          this.cards[2].fileId = res.data.commentFileId
          this.cards[3].fileName = res.data.publishedFileName
          this.cards[3].fileId = res.data.publishedFileId
          this.cards[4].fileName = res.data.publishedLatexFileName
          this.cards[4].fileId = res.data.publishedLatexFileId
          this.cards[5].fileName = res.data.sourceFileName
          this.cards[5].fileId = res.data.sourceFileId
          this.cards[6].fileName = res.data.publicFileName
          this.cards[6].fileId = res.data.publicFileId
        })
      } else if (this.paperType === 1) {
        getExternalPaperFileInfo(sessionStorage.getItem('uid'), this.id).then(res => {
          this.cards[0].fileName = res.data.reviewFileName
          this.cards[0].fileId = res.data.reviewFileId
          this.cards[1].fileName = res.data.submissionFileName
          this.cards[1].fileId = res.data.submissionFileId
          this.cards[2].fileName = res.data.commentFileName
          this.cards[2].fileId = res.data.commentFileId
          this.cards[3].fileName = res.data.publishedFileName
          this.cards[3].fileId = res.data.publishedFileId
          this.cards[4].fileName = res.data.publishedLatexFileName
          this.cards[4].fileId = res.data.publishedLatexFileId
          this.cards[5].fileName = res.data.sourceFileName
          this.cards[5].fileId = res.data.sourceFileId
          this.cards[6].fileName = res.data.publicFileName
          this.cards[6].fileId = res.data.publicFileId
        })
      }
    }
  }
}
</script>

<style>
    .files {
        min-height: calc(100vh - 280px);
        max-width: 1256px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px 20px 0;
    }
</style>
