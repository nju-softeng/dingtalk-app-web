<template>
  <div class="app-container">
    <div class="eventDetailWrap">
      <el-card shadow="hover" class="headCard">
        <el-page-header content="活动详情" style="margin-left: 50px" @back="goBack" />
        <div class="eventName">活动名称： {{ eventInfo.name }}</div>
        <div class="eventOtherAttributes">
          <div>{{ typeConverter[eventInfo.type] }}</div>
          <el-divider direction="vertical" class="divider" />
          <div class="eventYear">年份： {{ eventInfo.year }}年</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="bodyCard">
        <div class="fileHead">
          <div>活动图片</div>
          <el-button type="primary" @click="uploadType='活动图片'; acceptFileType = '.jpg,.png'; updateFileType = 'Picture'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="pictureFileList.length !== 0">
            <div v-for="(file, index) in pictureFileList" :key="file.url" class="hoverFile">
              <div class="hoverButtons">
                <el-button class="hoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="hoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index, 'Picture')" />
              </div>
              <el-image :src="file.url" fit="contain" lazy />
            </div>
            <div v-show="haveMorePic" class="moreFile">
              <el-button class="moreBtn" @click="getMorePicture">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无活动图片！
            </div>
          </div>
        </div>
        <div class="fileHead">
          <div>活动视频</div>
          <el-button type="primary" @click="uploadType='活动视频'; acceptFileType = '.mp4,.avi'; updateFileType = 'Video'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="videoFileList.length !== 0">
            <el-image v-for="file in pictureFileList" :key="file.url" :src="file.url" fit="contain" lazy />
            <div v-show="haveMoreVideo" class="moreFile">
              <el-button class="moreBtn">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无活动视频！
            </div>
          </div>
        </div>
        <div class="fileHead">
          <div>活动文档</div>
          <el-button type="primary" @click="uploadType='活动文档'; acceptFileType = '.doc,.docx,.pdf,.md'; updateFileType = 'Doc'; uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="docFileList.length !== 0">
            <el-card v-for="file in docFileList" :key="file.url" lazy>
              <i class="el-icon-document"/>
              <p>{{ file.fileName }}</p>
            </el-card>
            <div v-show="haveMoreDoc" class="moreFile">
              <el-button class="moreBtn" @click="getMoreDoc">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无活动文档！
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
            <el-radio-button label="活动图片" />
            <el-radio-button label="活动视频" />
            <el-radio-button label="活动文档" />
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
import { getEventInfo, addEventPropertyFile, downloadEventFile, deleteEventPropertyFile } from '@/api/eventProperty'

export default {
  name: 'EventDetail',
  data() {
    return {
      id: 0,
      typeConverter: ['项目会议', '团队组织/参与的活动', '实验室活动'],
      eventInfo: {
        name: '无活动名！',
        year: 2000,
        type: 0,
        pictureFileList: [],
        videoFileList: [],
        docFileList: []
      },
      pictureFileList: [],
      videoFileList: [],
      docFileList: [],
      uploadFileVisible: false,
      uploadType: '活动图片',
      acceptFileType: '.jpg,.png',
      updateFileType: 'Picture',
      haveMorePic: false,
      haveMoreVideo: false,
      haveMoreDoc: false,
      pageMax: 5
    }
  },
  async created() {
    this.id = this.$route.params.id
    await getEventInfo(this.id).then(async res => {
      if (res) {
        this.eventInfo = res.data
          console.log(this.eventInfo)
        for (let i = 0; i < this.pageMax && i < res.data.pictureFileList.length; i++) {
          await downloadEventFile(res.data.pictureFileList[i].id).then(result => {
            const binaryData = [result.data]
            const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.pictureFileList[i]) }))
            this.pictureFileList = this.pictureFileList.concat([{
              id: res.data.pictureFileList[i].id,
              fileName: res.data.pictureFileList[i].fileName,
              url: url
            }])
          })
        }
      }
    }).catch(() => {
      this.$message.error('无法获取活动信息')
    })
    this.haveMorePic = this.pictureFileList.length < this.eventInfo.pictureFileList.length
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
      this.$router.push('/property/event/')
    },
    async handleFileUpload(data) {
      const fd = new FormData()
      fd.append('eventPropertyFile', data.file)
      fd.append('fileType', this.updateFileType)
      const res1 = await addEventPropertyFile(this.id, fd)
      if (res1) {
        this.$notify.success('上传成功!')
      } else {
        this.$notify.error('上传失败!')
      }
      this.$refs.fileUpload.clearFiles()
    },
    handleTypeChange(chosenLabel) {
      switch (chosenLabel) {
        case '活动图片':
          this.acceptFileType = '.jpg,.png'
          this.updateFileType = 'Picture'
          break
        case '活动视频':
          this.acceptFileType = '.mp4,.avi'
          this.updateFileType = 'Video'
          break
        case '活动文档':
          this.acceptFileType = '.doc,.docx,.pdf,.md'
          this.updateFileType = 'Doc'
          break
      }
    },
    async getMorePicture() {
      const init = this.pictureFileList.length
      for (let i = init; i < init + 6 && i < this.eventInfo.pictureFileList.length; i++) {
        await downloadEventFile(this.eventInfo.pictureFileList[i].id).then(result => {
          const binaryData = [result.data]
          const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(this.eventInfo.pictureFileList[i]) }))
          this.pictureFileList = this.pictureFileList.concat([{
            id: this.eventInfo.pictureFileList[i].id,
            fileName: this.eventInfo.pictureFileList[i].fileName,
            url: url
          }])
        })
      }
      this.haveMorePic = this.haveMorePic = this.pictureFileList.length < this.eventInfo.pictureFileList.length
      this.pageMax += 6
    },
    downloadFile(file) {
      downloadEventFile(file.id).then(res => {
        const binaryData = [res.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(file) }))
        const a = document.createElement('a')
        a.download = file.fileName
        a.href = url
        a.click()
      })
    },
    deleteFile(file, index, type) {
      deleteEventPropertyFile(this.id, file.id, type).then(async res => {
        if (res) {
          this.$notify.success('删除完成！')
          switch (type) {
            case 'Picture':
              this.pictureFileList.splice(index, 1)
              break
            case 'Video':
              this.videoFileList.splice(index, 1)
              break
            case 'Doc':
              this.docFileList.splice(index, 1)
              break
          }
          await this.refreshPictureList()
          if (this.eventInfo.pictureFileList.length <= this.pageMax - 6) {
            this.pageMax -= 6
          }
        }
      }).catch(() => {
        this.$notify.error('删除失败！')
      })
    },
    async refreshBeforeClose(done) {
      await this.refreshPictureList()
      return done(true)
    },
    async refreshPictureList() {
      const res = await getEventInfo(this.id)
      if (res) {
        this.eventInfo = res.data
      }
      const init = this.pictureFileList.length
      for (var i = init; i < this.pageMax && i < res.data.pictureFileList.length; i++) {
        const result = await downloadEventFile(res.data.pictureFileList[i].id)
        const binaryData = [result.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.pictureFileList[i]) }))
        this.pictureFileList = this.pictureFileList.concat([{
          id: res.data.pictureFileList[i].id,
          fileName: res.data.pictureFileList[i].fileName,
          url: url
        }])
      }
      this.haveMorePic = this.pictureFileList.length < this.eventInfo.pictureFileList.length
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

  .eventDetailWrap {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .headCard {
    border-radius: 50px;
    min-height: 150px
  }

  .eventName {
    margin: 20px auto auto 40px;
    font-size: x-large;
  }

  .eventOtherAttributes {
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
    margin: 0 0 10px 30px;
    display: flex;
    justify-content: space-between;
  }

  .fileBody {
    height: 400px;
    overflow-y: auto;
  }

  .hoverFile {
    width: 48%;
    height: 380px;
    margin: 1%;
    position: relative;
    display: inline-block;
    overflow: hidden
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

  .hoverBtn {
    height: 25%;
    width: 20%;
    margin: 5%;
    font-size: 500%;
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
    height: 380px;
    width: 48%;
    margin: 1%;
    position: relative;
    display: inline-block;
    overflow: hidden
  }

  .moreBtn {
    border: 0;
    height: 100%;
    width: 100%;
  }

</style>
