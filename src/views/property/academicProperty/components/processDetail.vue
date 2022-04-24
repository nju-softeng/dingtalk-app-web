<template>
  <div class="app-container">
    <div class="processDetailWrap">
      <el-card shadow="hover" class="headCard">
        <el-page-header content="会议详情" style="margin-left: 50px" @back="goBack" />
        <div class="processName">会议名称： {{ processInfo.name }}</div>
        <div class="processOtherAttributes">
          <div>{{ typeConverter[processInfo.type] }}</div>
          <el-divider direction="vertical" class="divider" />
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
            <div v-for="(file, index) in personalPhotoFileList" :key="file.url" class="hoverFile picHoverFile">
              <div class="hoverButtons">
                <el-button class="picHoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="picHoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index, 'Picture')" />
              </div>
              <el-image :src="file.url" fit="contain" lazy />
            </div>
            <div v-show="haveMorePersonalPhoto" class="moreFile picMoreFile">
              <el-button class="moreBtn" @click="getMorePicture">
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
            <el-card v-for="(file, index) in conferencePhotoFileList" :key="file.url" body-style="padding: 0" class="hoverFile videoHoverFile">
              <div class="hoverButtons">
                <el-button class="videoHoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="videoHoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index, 'Video')" />
              </div>
              <i class="el-icon-video-camera videoIcon" />
              <p class="videoName">{{ file.fileName }}</p>
            </el-card>
            <div v-show="haveMoreConferencePhoto" class="moreFile videoMoreFile">
              <el-button class="moreBtn" @click="getMoreVideo">
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
          <div>会议文档</div>
          <el-button type="primary" @click="uploadType='会议文档'; acceptFileType = '.doc,.docx,.pdf,.md'; updateFileType = 'Doc'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="docFileList.length !== 0">
            <el-card v-for="(file, index) in docFileList" :key="file.url" body-style="padding: 0" class="hoverFile docHoverFile">
              <div class="hoverButtons">
                <el-button class="docHoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="docHoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index, 'Doc')" />
              </div>
              <i class="el-icon-document docIcon" />
              <p class="docName">{{ file.fileName }}</p>
            </el-card>
            <div v-show="haveMoreDoc" class="moreFile docMoreFile">
              <el-button class="moreBtn" @click="getMoreDoc">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无会议文档！
            </div>
          </div>
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
            <el-radio-button label="会议图片" />
            <el-radio-button label="会议视频" />
            <el-radio-button label="会议文档" />
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
      picEachPage: 6,
      videoEachPage: 8,
      docEachPage: 8,
      id: 0,
      typeConverter: ['项目会议', '团队组织/参与的会议', '实验室会议'],
      processInfo: {
        name: '无会议名！',
        year: 2000,
        type: 0,
        personalPhotoFileList: [],
        conferencePhotoFileList: [],
        docFileList: []
      },
      personalPhotoFileList: [],
      conferencePhotoFileList: [],
      docFileList: [],
      uploadFileVisible: false,
      uploadType: '会议图片',
      acceptFileType: '.jpg,.png',
      updateFileType: 'Picture',
      haveMorePersonalPhoto: false,
      haveMoreConferencePhoto: false,
      haveMoreDoc: false,
      picPageMax: 5,
      videoPageMax: 7,
      docPageMax: 7
    }
  },
  async created() {
    this.id = this.$route.params.id
    await getProcessPropertyInfo(this.id).then(async res => {
      if (res) {
          console.log(res)
        this.processInfo = res.data
        for (let i = 0; i < this.picPageMax && i < res.data.personalPhotoFileList.length; i++) {
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
        this.conferencePhotoFileList = this.processInfo.conferencePhotoFileList.slice(0, this.processInfo.conferencePhotoFileList.length < 7 ? this.processInfo.conferencePhotoFileList.length : 7)
        this.docFileList = this.processInfo.docFileList.slice(0, this.processInfo.docFileList.length < 7 ? this.processInfo.docFileList.length : 7)
      }
    }).catch(() => {
      this.$message.error('无法获取会议信息')
    })
    this.haveMorePersonalPhoto = this.personalPhotoFileList.length < this.processInfo.personalPhotoFileList.length
    this.haveMoreConferencePhoto = this.conferencePhotoFileList.length < this.processInfo.conferencePhotoFileList.length
    this.haveMoreDoc = this.docFileList.length < this.processInfo.docFileList.length
  },
  methods: {
    getType(file) {
      let type
      if (file.fileName.split('.')[-1] === '.md') {
        type = 'text/x-markdown'
      } else if (file.fileName.split('.')[-1] === '.pdf') {
        type = 'application/pdf'
      } else if (file.fileName.split('.')[-1] === '.doc') {
        type = 'application/msword'
      } else if (file.fileName.split('.')[-1] === '.docx') {
        type = 'application/vnd.openxmlformats-officedoucment.wordprocessingml.document'
      } else if (file.fileName.split('.')[-1] === '.jpg') {
        type = 'image/jpeg'
      } else if (file.fileName.split('.')[-1] === '.png') {
        type = 'image/png'
      } else if (file.fileName.split('.')[-1] === '.mp4') {
        type = 'video/mp4'
      } else if (file.fileName.split('.')[-1] === '.avi') {
        type = 'video/x-msvideo'
      }
      return type
    },
    goBack() {
      this.$router.push('/property/process/')
    },
    async handleFileUpload(data) {
      const fd = new FormData()
      fd.append('processPropertyFile', data.file)
      fd.append('fileType', this.updateFileType)
      const res1 = await addProcessFile(this.id, fd)
      if (res1) {
        this.$notify.success('上传成功!')
      } else {
        this.$notify.error('上传失败!')
      }
      this.$refs.fileUpload.clearFiles()
    },
    handleTypeChange(chosenLabel) {
      switch (chosenLabel) {
        case '会议图片':
          this.acceptFileType = '.jpg,.png'
          this.updateFileType = 'Picture'
          break
        case '会议视频':
          this.acceptFileType = '.mp4,.avi'
          this.updateFileType = 'Video'
          break
        case '会议文档':
          this.acceptFileType = '.doc,.docx,.pdf,.md'
          this.updateFileType = 'Doc'
          break
      }
    },
    async getMorePicture() {
      const init = this.personalPhotoFileList.length
      for (let i = init; i < init + this.picEachPage && i < this.processInfo.personalPhotoFileList.length; i++) {
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
      this.picPageMax += this.picEachPage
    },
    async getMoreVideo() {
      const init = this.conferencePhotoFileList.length
      const end = this.processInfo.conferencePhotoFileList.length < init + this.videoEachPage ? this.processInfo.conferencePhotoFileList.length : init + this.videoEachPage
      this.conferencePhotoFileList = this.conferencePhotoFileList.concat(this.processInfo.conferencePhotoFileList.slice(init, end))
      this.haveMoreConferencePhoto = this.conferencePhotoFileList.length < this.processInfo.conferencePhotoFileList.length
      this.videoPageMax += this.videoEachPage
    },
    async getMoreDoc() {
      const init = this.docFileList.length
      const end = this.processInfo.docFileList.length < init + this.docEachPage ? this.processInfo.docFileList.length : init + this.docEachPage
      this.docFileList = this.docFileList.concat(this.processInfo.docFileList.slice(init, end))
      this.haveMoreDoc = this.docFileList.length < this.processInfo.docFileList.length
      this.docPageMax += this.docEachPage
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
            case 'Picture':
              this.personalPhotoFileList.splice(index, 1)
              await this.refreshPictureList()
              if (this.processInfo.personalPhotoFileList.length <= this.picPageMax - this.picEachPage) {
                this.picPageMax -= this.picEachPage
              }
              break
            case 'Video':
              this.conferencePhotoFileList.splice(index, 1)
              await this.refreshVideoList()
              if (this.processInfo.conferencePhotoFileList.length <= this.videoPageMax - this.videoEachPage) {
                this.picPageMax -= this.videoEachPage
              }
              break
            case 'Doc':
              this.docFileList.splice(index, 1)
              await this.refreshDocList()
              if (this.processInfo.docFileList.length <= this.docPageMax - this.docEachPage) {
                this.picPageMax -= this.docEachPage
              }
              break
          }
        }
      }).catch(() => {
        this.$notify.error('删除失败！')
      })
    },
    async refreshBeforeClose(done) {
      await this.refreshPictureList()
      await this.refreshVideoList()
      await this.refreshDocList()
      return done(true)
    },
    async refreshPictureList() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
      }
      const init = this.personalPhotoFileList.length
      for (var i = init; i < this.picPageMax && i < res.data.personalPhotoFileList.length; i++) {
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
    async refreshVideoList() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
      }
      const init = this.conferencePhotoFileList.length
      const end = this.processInfo.conferencePhotoFileList.length < this.videoPageMax ? this.processInfo.conferencePhotoFileList.length : this.videoPageMax
      this.conferencePhotoFileList = this.conferencePhotoFileList.concat(this.processInfo.conferencePhotoFileList.slice(init, end))
      this.haveMoreConferencePhoto = this.conferencePhotoFileList.length < this.processInfo.conferencePhotoFileList.length
    },
    async refreshDocList() {
      const res = await getProcessPropertyInfo(this.id)
      if (res) {
        this.processInfo = res.data
      }
      const init = this.docFileList.length
      const end = this.processInfo.docFileList.length < this.docPageMax ? this.processInfo.docFileList.length : this.docPageMax
      this.docFileList = this.docFileList.concat(this.processInfo.docFileList.slice(init, end))
      this.haveMoreDoc = this.docFileList.length < this.processInfo.docFileList.length
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

  .divider {
    height: 16px;
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

  .picHoverFile {
    width: 48%;
    height: 380px;
  }

  .videoHoverFile {
    width: 23%;
    height: 160px;
  }

  .docHoverFile {
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

  .picHoverBtn {
    height: 25%;
    width: 20%;
    margin: 5%;
    font-size: 500%;
    background-color: rgba(0,0,0,0);
    border: 0;
    font-weight: bolder;
    color: white;
  }

  .videoHoverBtn {
    height: 50%;
    width: 25%;
    margin: 5%;
    font-size: 300%;
    background-color: rgba(0,0,0,0);
    border: 0;
    font-weight: bolder;
    color: white;
  }

  .docHoverBtn {
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
    text-align: center;
  }

  .moreFile {
    margin: 1%;
    position: relative;
    display: inline-block;
    overflow: hidden
  }

  .picMoreFile {
    height: 380px;
    width: 48%;
  }

  .videoMoreFile {
    height: 160px;
    width: 23%;
  }

  .docMoreFile {
    height: 160px;
    width: 23%;
  }

  .moreBtn {
    border: 0;
    height: 100%;
    width: 100%;
  }

  .videoIcon {
    margin: 2em 2em 0 2em;
  }

  .videoName {
    margin-left: 2em;
    width: 80%;
    word-break: break-word;
  }

  .docIcon {
    margin: 2em 2em 0 2em;
  }

  .docName {
    margin-left: 2em;
    width: 80%;
    word-break: break-word;
  }
</style>
