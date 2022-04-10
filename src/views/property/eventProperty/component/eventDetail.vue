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
        <div class="picHead">
          <div>活动图片</div>
          <div>活动图片</div>
        </div>
        <div class="picBody">
          <div v-if="fileList.length !== 0">
            <el-image v-for="files in fileList" :key="files.name" :src="files.url" fit="contain" lazy />
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无活动图片！
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="上传文件"
      :visible.sync="uploadFileVisible"
      width="30%"
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
import { getEventInfo, addEventPropertyFile } from '@/api/eventProperty'

export default {
  name: 'EventDetail',
  data() {
    return {
      id: 0,
      typeConverter: ['项目会议', '团队组织/参与的活动', '实验室活动'],
      eventInfo: {
        name: '无活动名！',
        year: 2000,
        type: 0
      },
      fileList: [],
      uploadFileVisible: true,
      uploadType: '活动图片',
      acceptFileType: '.jpg,.png',
      updateFileType: 'Picture'
    }
  },
  created() {
    this.id = this.$route.params.id
    getEventInfo(this.id).then(res => {
      if (res) {
        this.eventInfo = res.data
      }
    }).catch(() => {
      this.$message.error('无法获取活动信息')
    })
  },
  methods: {
    goBack() {
      this.$router.push('/property/event/')
    },
    handleFileUpload(data) {
      const fd = new FormData()
      fd.append('eventPropertyFile', data.file)
      fd.append('fileType', this.updateFileType)
      addEventPropertyFile(this.id, fd).then(res => {
        if (res) {
          this.$notify.success('上传成功!')
        }
      }).catch(() => {
        this.$notify.error('上传失败!')
      })
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

  .picHead {
    font-size: larger;
    margin: 0 0 10px 30px;
    display: flex;
    justify-content: space-between;
  }

  .picBody {
    height: 400px;
    overflow-y: auto;
  }

  .picBody .el-image {
    width: 48%;
    height: 100%;
    margin: 1%;
    background: #f3f3f3;
  }

  .picBody .el-image:last-child {
    margin-bottom: 0;
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

</style>
