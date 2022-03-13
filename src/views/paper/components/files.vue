<template>
  <div class="files">
    <el-timeline>
      <file-card
        v-for="item in cards"
        :key="item.index"
        :card="item"
        :paper-id="id"
        @init="init"
      />
    </el-timeline>
  </div>
</template>

<script>
import { getPaperFileInfo } from '@/api/paperFile'
import fileCard from './fileCard'

export default {
  components: { fileCard },
  data() {
    return {
      cards: [
        { fileName: '', fileId: '', fileTypeZHCN: '组内评审版本文件', fileType: 'reviewFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '提交时文件', fileType: 'submissionFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '发表版本文件', fileType: 'publishedFile' },
        { fileName: '', fileId: '', fileTypeZHCN: '发表版本LATEX文件', fileType: 'publishedLatexFile' }
      ]
    }
  },
  computed: {},
  created() {
    this.id = this.$route.params.id
    this.init()
  },
  methods: {
    init() {
      getPaperFileInfo(sessionStorage.getItem('uid'), this.id).then(res => {
        this.cards[0].fileName = res.data.reviewFileName
        this.cards[0].fileId = res.data.reviewFileId
        this.cards[1].fileName = res.data.submissionFileName
        this.cards[1].fileId = res.data.submissionFileId
        this.cards[2].fileName = res.data.publishedFileName
        this.cards[2].fileId = res.data.publishedFileId
        this.cards[3].fileName = res.data.publishedLatexFileName
        this.cards[3].fileId = res.data.publishedLatexFileId
      })
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
