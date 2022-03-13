<template>
  <el-timeline-item timestamp="组内评审版本文件" placement="top">
    <el-card>
      <h4 v-if="card.fileName == null">文件未上传！</h4>
      <h4 v-else>{{ card.fileName }}</h4>
      <span class="rightFooter">
        <el-tooltip
          class="item"
          effect="dark"
          :content="tipContent"
          placement="right"
        >
          <span style="align-self: center; margin-right: 20px"> <svg-icon icon-class="hint" /></span>
        </el-tooltip>
        <el-upload
          class="uploadFIle"
          :on-change="handleFileChange"
          :show-file-list="false"
          action=""
          :auto-upload="false"
          :accept="acceptType"
        >
          <el-button icon="el-icon-upload2" type="success" style="margin-right: 20px" round>上 传</el-button>
        </el-upload>
        <el-button icon="el-icon-download" type="primary" style="margin-right: 10px" round @click="downloadFile">下 载</el-button>
        <el-button icon="el-icon-delete" type="danger" style="margin-right: 15px" round @click="deleteFile">删 除</el-button>
      </span>
    </el-card>
  </el-timeline-item>
</template>

<script>
import { addPaperFile, getPaperFileDownloadInfo, deletePaperFile } from '@/api/paperFile'
export default {
  name: 'FileCard',
  props: {
    card: {
      type: Object,
      default: function() {
        return null
      }
    },
    paperId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tipContent: '',
      acceptType: ''
    }
  },
  created() {
    if (this.card.fileType === 'publishedLatexFile') {
      this.tipContent = '仅支持LaTeX格式文件'
      this.acceptType = '.tex'
    } else {
      this.tipContent = '仅支持Word/PDF格式文件'
      this.acceptType = '.pdf,.doc,.docx'
    }
    console.log(this.card)
  },
  methods: {
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('fileType', this.card.fileType)
      addPaperFile(sessionStorage.getItem('uid'), this.paperId, formData).then(() => {
        this.$notify({
          title: '成功',
          message: '论文文件上传成功',
          type: 'success'
        })
        this.$emit('init')
      }).catch(() => { this.$message.error('上传失败') })
    },
    downloadFile() {
      getPaperFileDownloadInfo(sessionStorage.getItem('uid'), this.card.fileId).then(res => {
        console.log(res)
        const fs = require('fs')
        const Axios = require('axios')
        const url = res.url
        const path = 'C:\\'
        const writer = fs.createWriteStream(path)
        Axios({
          url,
          method: 'GET',
          responseType: 'stream',
          headers: {
            '<headerKey1>': res.headerKey1,
            '<headerKey2>': res.headerKey2
          }
        }).then(function(response) {
          response.data.pipe(writer)
        })
      })
    },
    deleteFile() {
      const formData = new FormData()
      formData.append('fileType', this.card.fileType)
      deletePaperFile(sessionStorage.getItem('uid'), this.paperId, this.card.fileId, formData).then(() => {
        this.$notify({
          title: '成功',
          message: '论文文件删除成功',
          type: 'success'
        })
        this.$emit('init')
      }).catch(() => { this.$message.error('删除失败') })
    }
  }
}
</script>

<style scoped>
  .rightFooter {
    display: flex;
    justify-content: flex-end;
  }
</style>
