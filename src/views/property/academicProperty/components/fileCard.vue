<template>
  <el-timeline-item
    v-show="true"
    :timestamp="card.fileTypeZHCN"
    placement="top"
  >
    <el-card>
      <div style="display: flex; flex-direction: column;">
        <div
          v-if="card.fileName == null"
          style="font-weight: bold; font-size: 12px; margin-bottom: 5px;"
        >
          文件未上传！
        </div>
        <div
          v-else
          style="font-weight: bold; font-size: 12px; margin-bottom: 5px;"
        >
          文件名：{{ card.fileName }}
        </div>
        <div
          v-show="card.fileName != null"
          style="font-size: 12px; margin-bottom: 5px;"
        >
          文件路径： {{ getPath }}
        </div>
        <div>
          <span class="rightFooter">
            <el-tooltip
              v-if="dissertationUid === uid"
              class="item"
              effect="dark"
              :content="tipContent"
              placement="right"
            >
              <span style="align-self: center; margin-right: 5px">
                <svg-icon
                  icon-class="hint"
                /></span>
            </el-tooltip>
            <el-upload
              v-if="card.fileName == null && dissertationUid === uid"
              class="uploadFIle"
              :on-change="handleFileChange"
              :show-file-list="false"
              action=""
              :auto-upload="false"
              :accept="acceptType"
            >
              <el-button
                icon="el-icon-upload2"
                type="success"
                style="margin-right: 10px"
                round
              >上 传</el-button>
            </el-upload>
            <el-button
              v-if="card.fileName != null"
              icon="el-icon-download"
              type="primary"
              round
              @click="downloadFile"
            >下 载</el-button>
            <el-button
              v-show="card.fileName != null && dissertationUid === uid"
              icon="el-icon-delete"
              type="danger"
              round
              @click="deleteFile"
            >删 除</el-button>
          </span>
        </div>
      </div>
    </el-card>
  </el-timeline-item>
</template>

<script>
import {
  addDissertationFile,
  downloadDissertationFile,
  deleteDissertationFile
} from '@/api/dissertation'
export default {
  name: 'FileCard',
  props: {
    card: {
      type: Object,
      default: function() {
        return null
      }
    },
    dissertationUid: {
      type: Number,
      default: -1
    },
    filePath: {
      type: String,
      default: ''
    },
    dissertationId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      tipContent: '',
      acceptType: '',
      uid: -1
    }
  },
  computed: {
    getPath() {
      return (
        this.filePath +
        '/' +
        this.card.fileType.substring(0, 1).toUpperCase() +
        this.card.fileType.substring(1, this.card.fileType.length - 4)
      )
    }
  },
  created() {
    this.uid = parseInt(sessionStorage.getItem('uid'))
    // console.log(this.card)
    if (this.card.fileType === 'finalFile') {
      this.tipContent = '仅支持Zip/Rar格式文件'
      this.acceptType = '.zip,.rar'
    } else {
      this.tipContent = '仅支持Word/PDF格式文件'
      this.acceptType = '.pdf,.doc,.docx'
    }
  },
  methods: {
    // typeChange(fileType) {
    //   return fileType.substring(0, 1).toUpperCase() + fileType.substring(1, fileType.length - 4)
    // },
    handleFileChange(file, fileList) {
      while (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('fileType', this.card.fileType)
      addDissertationFile(this.dissertationId, formData)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '论文文件上传成功',
            type: 'success'
          })
          this.$emit('init')
        })
        .catch(() => {
          this.$message.error('上传失败')
        })
    },
    downloadFile() {
      if (!this.card.fileName) {
        this.$message.warning('文件未上传！请上传文件！')
        return
      }
      downloadDissertationFile(this.dissertationId, this.card.fileType).then(
        (res) => {
          let type
          if (this.card.fileName.split('.').slice(-1)[0] === '.zip') {
            type = 'application/zip'
          } else if (this.card.fileName.split('.').slice(-1)[0] === '.rar') {
            type = 'application/x-rar-compressed'
          } else if (this.card.fileName.split('.').slice(-1)[0] === '.pdf') {
            type = 'application/pdf'
          } else if (this.card.fileName.split('.').slice(-1)[0] === '.doc') {
            type = 'application/msword'
          } else if (this.card.fileName.split('.').slice(-1)[0] === '.docx') {
            type =
              'application/vnd.openxmlformats-officedoucment.wordprocessingml.document'
          }

          const binaryData = [res.data]
          const url = window.URL.createObjectURL(
            new Blob(binaryData, { type: type })
          )
          const a = document.createElement('a')
          a.download = this.card.fileName
          a.href = url
          a.click()
        }
      )
    },
    deleteFile() {
      if (this.card.fileName !== undefined && this.card.fileName !== null) {
        // console.log(this.card.fileName)
        deleteDissertationFile(this.dissertationId, this.card.fileType)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '论文文件删除成功',
              type: 'success'
            })
            this.$emit('init')
          })
          .catch(() => {
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
  /* justify-content: flex-end; */
}
</style>
