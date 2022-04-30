<template>
  <el-timeline-item v-show="card.fileShow" :timestamp="card.fileTypeZHCN" placement="top">
    <el-card>
      <h3 v-if="card.fileName == null">文件未上传！</h3>
      <h3 v-else>{{ card.fileName }}</h3>
      <div v-show="card.fileName != null" style="font-weight: bold; font-size: 12px; float: left">文件路径： {{ getPath }} </div>
      <div>
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
      </div>
    </el-card>
  </el-timeline-item>
</template>

<script>
import { addPatentFile, downloadPatentFile, deletePatentFile } from '@/api/patent'
export default {
  name: 'FileCard',
  props: {
    card: {
      type: Object,
      default: function() {
        return null
      }
    },
    patentId: {
      type: String,
      default: ''
    },
    patentPath: {
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
  computed: {
    getPath() {
      return this.patentPath + '/' + this.card.fileType.substring(0, 1).toUpperCase() + this.card.fileType.substring(1, this.card.fileType.length - 4)
    }
  },
  created() {
    if (this.card.fileType === 'publishedLatexFile') {
      this.tipContent = '仅支持LaTeX格式文件'
      this.acceptType = '.tex'
    } else if (this.card.fileType === 'sourceFile') {
      this.tipContent = '仅支持Zip/Rar格式文件'
      this.acceptType = '.zip,.rar'
    } else {
      this.tipContent = '仅支持Word/PDF格式文件'
      this.acceptType = '.pdf,.doc,.docx'
    }
  },
  methods: {
    handleFileChange(file, fileList) {
      while (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      addPatentFile(this.patentId, this.card.fileType, formData).then(() => {
        this.$notify({
          title: '成功',
          message: '专利文件上传成功',
          type: 'success'
        })
        this.$emit('init')
      }).catch(() => {
        this.$message.error('上传失败')
      })
    },
    downloadFile() {
      if (!this.card.fileName) {
        this.$message.warning('文件未上传！请上传文件！')
        return
      }
      downloadPatentFile(this.patentId, this.card.fileType).then(res => {
        let type
        if (this.card.fileName.split('.').slice(-1)[0] === '.tex') {
          type = 'application/x-tex'
        } else if (this.card.fileName.split('.').slice(-1)[0] === '.zip') {
          type = 'application/zip'
        } else if (this.card.fileName.split('.').slice(-1)[0] === '.rar') {
          type = 'application/x-rar-compressed'
        } else if (this.card.fileName.split('.').slice(-1)[0] === '.pdf') {
          type = 'application/pdf'
        } else if (this.card.fileName.split('.').slice(-1)[0] === '.doc') {
          type = 'application/msword'
        } else if (this.card.fileName.split('.').slice(-1)[0] === '.docx') {
          type = 'application/vnd.openxmlformats-officedoucment.wordprocessingml.document'
        }
        const binaryData = [res.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: type }))
        const a = document.createElement('a')
        a.download = this.card.fileName
        a.href = url
        a.click()
      })
    },
    deleteFile() {
      if (this.card.fileName !== undefined && this.card.fileName !== null) {
        console.log(this.card.fileName)
        deletePatentFile(this.patentId, this.card.fileType).then(() => {
          this.$notify({
            title: '成功',
            message: '专利文件删除成功',
            type: 'success'
          })
          this.$emit('init')
        }).catch(() => {
          this.$message.error('删除失败')
        })
      } else {
        this.$message.error('未上传文件！')
      }
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
