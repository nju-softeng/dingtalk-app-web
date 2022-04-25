<template>
  <div class="app-container">
    <div class="processDetailWrap">
      <el-card shadow="hover" class="headCard">
        <el-page-header content="会议详情" style="margin-left: 50px" @back="goBack" />
        <el-tooltip
          effect="dark"
          content="邀请函"
          placement="top"
          class="invitation"
        >
          <div v-if="invitationSrc!=='PDF!'">
            <div v-show="invitationSrc!==''" class="hoverDeleteInvitation">
              <el-button icon="el-icon-delete" size="mini" class="deleteInvitation" @click="popoutConfirmDeleteInvitation" />
            </div>
            <el-image
              style="width: 80px; height: 100px"
              :src="invitationSrc"
              :preview-src-list="[invitationSrc]"
              fit="contain"
            >
              <div slot="error" class="addInvitation">
                <el-upload
                  class="invitationUploader"
                  action=""
                  :show-file-list="false"
                  style="width: 80px; height: 100px"
                  icon="el-icon-plus"
                  :http-request="handleFileUpload"
                  accept=".jpg,.png,.pdf"
                  :before-upload="changeToInvitation"
                >
                  <i class="el-icon-plus invitationUploaderIcon" />
                </el-upload>
              </div>
            </el-image>
          </div>
          <div v-else>
            <div class="hoverDeleteInvitation">
              <el-button icon="el-icon-delete" size="mini" class="deleteInvitation" @click="popoutConfirmDeleteInvitation" />
            </div>
            <div class="invitationPdf">
              <i class="el-icon-s-claim" /><br>
              <p class="invitationPdfName">
                {{ processInfo.invitationFile.fileName }}
              </p>
            </div>
          </div>
        </el-tooltip>
        <div class="processName">会议名称： {{ processInfo.conferenceName }}</div>
        <div class="processOtherAttributes">
          <div class="processYear">年份： {{ processInfo.year }}年</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="bodyCard">
        <div class="fileHead">
          <div>个人参会照片</div>
          <el-button type="primary" @click="uploadType='个人参会照片'; acceptFileType = '.jpg,.png'; updateFileType = 'personalPhotoFile'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="personalPhotoFileList.length !== 0">
            <div v-for="(file, index) in personalPhotoFileList" :key="file.url" class="hoverFile personalPhotoHoverFile">
              <div class="hoverButtons">
                <el-button class="personalPhotoHoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="personalPhotoHoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index, 'personalPhotoFile')" />
              </div>
              <el-image :src="file.url" fit="contain" lazy />
            </div>
            <div v-show="haveMorePersonalPhoto" class="moreFile personalPhotoMoreFile">
              <el-button class="moreBtn" @click="getMorePersonalPhoto">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无个人参会照片！
            </div>
          </div>
        </div>
        <div class="fileHead">
          <div>参会地宣传用照片</div>
          <el-button type="primary" @click="uploadType='参会地宣传用照片'; acceptFileType = '.jpg,.png'; updateFileType = 'conferencePhotoFile'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="conferencePhotoFileList.length !== 0">
            <el-card v-for="(file, index) in conferencePhotoFileList" :key="file.url" body-style="padding: 0" class="hoverFile conferencePhotoHoverFile">
              <div class="hoverButtons">
                <el-button class="conferencePhotoHoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="conferencePhotoHoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index, 'conferencePhotoFile')" />
              </div>
              <i class="el-icon-video-camera conferencePhotoIcon" />
              <p class="conferencePhotoName">{{ file.fileName }}</p>
            </el-card>
            <div v-show="haveMoreConferencePhoto" class="moreFile conferencePhotoMoreFile">
              <el-button class="moreBtn" @click="getMoreConferencePhoto">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无参会地宣传用照片！
            </div>
          </div>
        </div>
        <div class="fileHead">
          <div>会议PPT</div>
          <el-button type="primary" @click="uploadType='会议PPT'; acceptFileType = '.ppt,.pptx'; updateFileType = 'PPTFile'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="上传文件"
      :visible.sync="uploadFileVisible"
      width="30%"
      :before-close="refreshBeforeClose"
    >
      <div class="uploadHead">
        <div style="display: inline">请选择文件类型：</div>
        <div style="display: inline">
          <el-radio-group v-model="uploadType" fill="#409EFF" text-color="#ffffff" @change="handleTypeChange">
            <el-radio-button label="个人参会照片" />
            <el-radio-button label="参会场地宣传用照片" />
          </el-radio-group>
        </div>
      </div>
      <el-upload
        ref="fileUpload"
        class="fileUpload"
        drag
        action=""
        multiple
        :http-request="handleFileUpload"
        :accept="acceptFileType"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          拖拽上传或 <em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getProcessPropertyInfo, addProcessFile, downloadProcessFile, deleteProcessFile } from '@/api/processProperty'
export default {
  name: 'ProcessDetail',
  data() {
    return {
      personalPhotoEachPage: 6,
      conferencePhotoEachPage: 6,
      id: 0,
      invitationSrc: '',
      processInfo: {
        id: -1,
        conferenceName: '无会议名！',
        year: 2000,
        filePath: '',
        user: null,
        invitationFile: null,
        PPTFile: null,
        personalPhotoFileList: [],
        conferencePhotoFileList: []
      },
      personalPhotoFileList: [],
      conferencePhotoFileList: [],
      uploadFileVisible: false,
      uploadType: '会议图片',
      acceptFileType: '.jpg,.png',
      updateFileType: 'personalPhotoFile',
      haveMorePersonalPhoto: false,
      haveMoreConferencePhoto: false,
      personalPhotoPageMax: 5,
      conferencePhotoPageMax: 5
    }
  },
  async created() {
    this.id = this.$route.params.id
    await getProcessPropertyInfo(this.id).then(async res => {
      if (res) {
        this.processInfo = res.data
        for (let i = 0; i < this.personalPhotoPageMax && i < res.data.personalPhotoFileList.length; i++) {
          await downloadProcessFile(res.data.personalPhotoFileList[i].id).then(result => {
            const binaryData = [result.data]
            const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.personalPhotoFileList[i]) }))
            this.personalPhotoFileList = this.personalPhotoFileList.concat([{
              id: res.data.personalPhotoFileList[i].id,
              fileName: res.data.personalPhotoFileList[i].fileName,
              url: url
            }])
          })
        }
        if (res.data.invitationFile) {
          if (res.data.invitationFile.fileName.split('.').slice(-1)[0] === 'pdf') {
            this.invitationSrc = 'PDF!'
          } else {
            const result = await downloadProcessFile(res.data.invitationFile.id)
            const binaryData = [result.data]
            this.invitationSrc = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.invitationFile) }))
          }
        }
      }
    }).catch(err => {
      console.log(err)
      this.$message.error('无法获取会议信息')
    })
    this.haveMorePersonalPhoto = this.personalPhotoFileList.length < this.processInfo.personalPhotoFileList.length
    this.haveMoreConferencePhoto = this.conferencePhotoFileList.length < this.processInfo.conferencePhotoFileList.length
  },
  methods: {
    getType(file) {
      let type
      if (file.fileName.split('.')[-1] === '.md') {
        type = 'text/x-markdown'
      } else if (file.fileName.split('.')[-1] === '.pdf') {
        type = 'application/pdf'
      } else if (file.fileName.split('.')[-1] === '.jpg') {
        type = 'image/jpeg'
      } else if (file.fileName.split('.')[-1] === '.png') {
        type = 'image/png'
      }
      return type
    },
    goBack() {
      this.$router.push('/property/academic/process')
    },
    async handleFileUpload(data) {
      const fd = new FormData()
      fd.append('file', data.file)
      fd.append('fileType', this.updateFileType)
      const res1 = await addProcessFile(this.id, fd)
      if (res1) {
        this.$notify.success('上传成功!')
        if (this.updateFileType === 'invitationFile') {
          this.refreshInvitation()
        } else if (this.updateFileType === 'PPTFile') {
          this.refreshPPT()
        }
      } else {
        this.$notify.error('上传失败!')
      }
      this.$refs.fileUpload.clearFiles()
    },
    handleTypeChange(chosenLabel) {
      switch (chosenLabel) {
        case '个人参会照片':
          this.acceptFileType = '.jpg,.png'
          this.updateFileType = 'personalPhotoFile'
          break
        case '参会地宣传用照片':
          this.acceptFileType = '.jpg,.png'
          this.updateFileType = 'conferencePhotoFile'
          break
      }
    },
    async getMorePersonalPhoto() {
      const init = this.personalPhotoFileList.length
      for (let i = init; i < init + this.personalPhotoEachPage && i < this.processInfo.personalPhotoFileList.length; i++) {
        await downloadProcessFile(this.processInfo.personalPhotoFileList[i].id).then(result => {
          const binaryData = [result.data]
          const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(this.processInfo.personalPhotoFileList[i]) }))
          this.personalPhotoFileList = this.personalPhotoFileList.concat([{
            id: this.processInfo.personalPhotoFileList[i].id,
            fileName: this.processInfo.personalPhotoFileList[i].fileName,
            url: url
          }])
        })
      }
      this.haveMorePersonalPhoto = this.personalPhotoFileList.length < this.processInfo.personalPhotoFileList.length
      this.personalPhotoPageMax += this.personalPhotoEachPage
    },
    async getMoreConferencePhoto() {
      const init = this.conferencePhotoFileList.length
      const end = this.processInfo.conferencePhotoFileList.length < init + this.conferencePhotoEachPage ? this.processInfo.conferencePhotoFileList.length : init + this.conferencePhotoEachPage
      this.conferencePhotoFileList = this.conferencePhotoFileList.concat(this.processInfo.conferencePhotoFileList.slice(init, end))
      this.haveMoreConferencePhoto = this.conferencePhotoFileList.length < this.processInfo.conferencePhotoFileList.length
      this.conferencePhotoPageMax += this.conferencePhotoEachPage
    },
    downloadFile(file) {
      downloadProcessFile(file.id).then(res => {
        const binaryData = [res.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(file) }))
        const a = document.createElement('a')
        a.download = file.fileName
        a.href = url
        a.click()
      })
    },
    deleteFile(file, index, type) {
      deleteProcessFile(this.id, file.id, type).then(async res => {
        if (res) {
          this.$notify.success('删除完成！')
          switch (type) {
            case 'personalPhoto':
              this.personalPhotoFileList.splice(index, 1)
              await this.refreshPersonalPhotoList()
              if (this.processInfo.personalPhotoFileList.length <= this.personalPhotoPageMax - this.personalPhotoEachPage) {
                this.personalPhotoPageMax -= this.personalPhotoEachPage
              }
              break
            case 'ConferencePhotoFile':
              this.conferencePhotoFileList.splice(index, 1)
              await this.refreshConferencePhotoList()
              if (this.processInfo.conferencePhotoFileList.length <= this.conferencePhotoPageMax - this.conferencePhotoEachPage) {
                this.personalPhotoPageMax -= this.conferencePhotoEachPage
              }
              break
          }
        }
      }).catch(() => {
        this.$notify.error('删除失败！')
      })
    },
    async refreshBeforeClose(done) {
      await this.refreshPersonalPhotoList()
      await this.refreshConferencePhotoList()
      return done(true)
    },
    async refreshPersonalPhotoList() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
      }
      const init = this.personalPhotoFileList.length
      for (var i = init; i < this.personalPhotoPageMax && i < res.data.personalPhotoFileList.length; i++) {
        const result = await downloadProcessFile(res.data.personalPhotoFileList[i].id)
        const binaryData = [result.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.personalPhotoFileList[i]) }))
        this.personalPhotoFileList = this.personalPhotoFileList.concat([{
          id: res.data.personalPhotoFileList[i].id,
          fileName: res.data.personalPhotoFileList[i].fileName,
          url: url
        }])
      }
      this.haveMorePersonalPhoto = this.personalPhotoFileList.length < this.processInfo.personalPhotoFileList.length
    },
    async refreshConferencePhotoList() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
      }
      const init = this.conferencePhotoFileList.length
      const end = this.processInfo.conferencePhotoFileList.length < this.conferencePhotoPageMax ? this.processInfo.conferencePhotoFileList.length : this.conferencePhotoPageMax
      this.conferencePhotoFileList = this.conferencePhotoFileList.concat(this.processInfo.conferencePhotoFileList.slice(init, end))
      this.haveMoreConferencePhoto = this.conferencePhotoFileList.length < this.processInfo.conferencePhotoFileList.length
    },
    changeToInvitation() {
      this.updateFileType = 'invitationFile'
    },
    async refreshInvitation() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
        if (res.data.invitationFile) {
          if (res.data.invitationFile.fileName.split('.').slice(-1)[0] === 'pdf') {
            this.invitationSrc = 'PDF!'
          } else {
            const result = await downloadProcessFile(res.data.invitationFile.id)
            const binaryData = [result.data]
            this.invitationSrc = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.invitationFile) }))
          }
        } else {
          this.invitationSrc = ''
        }
      }
    },
    async refreshPPT() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
      }
    },
    popoutConfirmDeleteInvitation() {
      this.$confirm('确定要永久删除邀请函?', '删除邀请函', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProcessFile(this.processInfo.id, this.processInfo.invitationFile.id, 'invitationFile').then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refreshInvitation()
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding: 12px;
    background-color: #fafafa;
    border-radius: 0;
  }

  .processDetailWrap {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .headCard {
    border-radius: 50px;
    min-height: 150px
  }

  .processName {
    margin: 20px auto auto 40px;
    font-size: x-large;
  }

  .processOtherAttributes {
    margin: 15px auto auto 40px;
    display: flex;
    font-size: small;
    color: #646464;
  }

  .bodyCard {
    border-radius: 10px;
    margin-top: 36px;
  }

  .fileHead {
    font-size: larger;
    margin: 10px 0 10px 30px;
    display: flex;
    justify-content: space-between;
  }

  .fileBody {
    height: 400px;
    overflow-y: auto;
  }

  .hoverFile {
    margin: 1%;
    position: relative;
    display: inline-block;
    overflow: hidden
  }

  .personalPhotoHoverFile {
    width: 48%;
    height: 380px;
  }

  .conferencePhotoHoverFile {
    width: 23%;
    height: 160px;
  }

  .hoverButtons {
    width: 100%;
    height: 100%;
    background: #000000;
    position: absolute;
    z-index: 2;
    opacity: 0;
  }

  .hoverButtons:hover{
    opacity: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hoverDeleteInvitation {
    width: 16px;
    height: 16px;
    position: absolute;
    margin-left: 64px;
    opacity: 36%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .hoverDeleteInvitation:hover {
    opacity: 100%;
  }

  .deleteInvitation {
    background-color: rgba(0,0,0,0);
    font-weight: bolder;
    border: none;
    color: red;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    padding: 0;
  }

  .personalPhotoHoverBtn {
    height: 25%;
    width: 20%;
    margin: 5%;
    font-size: 500%;
    background-color: rgba(0,0,0,0);
    border: 0;
    font-weight: bolder;
    color: white;
  }

  .conferencePhotoHoverBtn {
    height: 50%;
    width: 25%;
    margin: 5%;
    font-size: 300%;
    background-color: rgba(0,0,0,0);
    border: 0;
    font-weight: bolder;
    color: white;
  }

  .fileBody .el-image {
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    position: absolute;
    z-index: 1;
  }

  .null {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
  }

  .uploadHead {
    margin-bottom: 20px;
  }

  .fileUpload {
    width: 27vw;
  }

  /deep/ .el-upload-dragger {
    width: 27vw;
  }

  .moreFile {
    margin: 1%;
    position: relative;
    display: inline-block;
    overflow: hidden
  }

  .personalPhotoMoreFile {
    height: 380px;
    width: 48%;
  }

  .conferencePhotoMoreFile {
    height: 160px;
    width: 23%;
  }

  .moreBtn {
    border: 0;
    height: 100%;
    width: 100%;
  }

  .conferencePhotoIcon {
    margin: 2em 2em 0 2em;
  }

  .conferencePhotoName {
    margin-left: 2em;
    width: 80%;
    word-break: break-word;
  }

  .invitation {
    border: 2px dashed #d9d9d9;
    float: right;
    width: 84px;
    height: 104px;
    margin: auto 100px 10px auto
  }

  .invitationUploader {
    cursor: pointer;
    position: relative;
  }

  .invitationUploaderIcon {
    width: 80px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: #7e7e7e;
  }

  .invitationPdf {
    padding-top: 10px;
    width: 80px;
    height: 100px;
    display: block;
    text-align: center;
    justify-content: center;
    font-size: 30px;
  }

  .invitationPdfName {
    padding: 2px;
    font-size: 13px;
    margin: 0;
  }
</style>
