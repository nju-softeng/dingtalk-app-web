<template>
  <div class="app-container">
    <div class="reimburseDetailWrap">
      <el-card shadow="hover" class="headCard">
        <el-page-header content="报销详情" style="margin-left: 50px" @back="goBack" />
        <div class="operation">
          <el-button v-show="reimburseInfo.state === -1" type="primary" class="operationButtons" @click="submitReimbursement">提交审核</el-button>
          <el-button v-show="reimburseInfo.state === 0 && role === 'admin'" type="success" class="operationButtons" @click="admitReimbursement">同意报销</el-button>
          <el-button v-show="reimburseInfo.state === 0 && role === 'admin'" type="danger" class="operationButtons" @click="rejectReimbursement">拒绝报销</el-button>
        </div>
        <div class="reimburseName">报销名称： {{ reimburseInfo.name }}</div>
        <div class="reimburseOtherAttributes">
          <div class="reimburseType">{{ reimburseInfo.type }}</div>
          <el-divider direction="vertical" />
          <div class="reimburseState">状态：
            <el-tag
              v-if="reimburseInfo.state === -1"
              class="reimburseTag"
              type="info"
            >未审核</el-tag>
            <el-tag
              v-else-if="reimburseInfo.state === 0"
              class="reimburseTag"
            >审核中</el-tag>
            <el-tag
              v-else-if="reimburseInfo.state === 1"
              class="reimburseTag"
              type="success"
            >审核通过</el-tag>
            <el-tag
              v-else-if="reimburseInfo.state === 2"
              class="reimburseTag"
              type="danger"
            >审核不通过</el-tag>
            <el-tag
              v-else
              class="reimburseTag"
              type="danger"
            >{{ reimburseInfo.state }}未知状态</el-tag>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="bodyCard">
        <div class="fileHead">
          <div>报销文件</div>
          <el-button v-show="reimburseInfo.state === -1" type="primary" @click="uploadFileVisible = true"> 上传文件</el-button>
        </div>
        <div class="fileBody">
          <div v-if="fileList.length !== 0">
            <div v-for="(file, index) in fileList" :key="file.url" class="hoverFile">
              <div class="hoverButtons">
                <span style="width: 500px; height: 30px" />
                <span class="description">{{ file.description }}</span>
                <el-button class="hoverBtn downloadBtn" icon="el-icon-download" @click="downloadFile(file)" />
                <el-button class="hoverBtn deleteBtn" icon="el-icon-delete" @click="deleteFile(file, index)" />
                <span style="width: 500px; height: 30px" />
              </div>
              <el-image :src="file.url" fit="contain" lazy />
            </div>
            <div v-show="haveMoreFile" class="moreFile">
              <el-button class="moreBtn" @click="getMoreFile">
                <i class="el-icon-more" style="font-size: 30px" /><br>
                More
              </el-button>
            </div>
          </div>
          <div v-else class="null">
            <svg-icon icon-class="null" style="font-size:32px" />
            <div style="font-size:13px;height:20px;color:rgba(0, 0, 0, 0.45);">
              暂无报销文件！
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
        <div style="display: inline">
          <el-select
            v-model="fileType"
            placeholder="请选择报销文件类型："
            style="width: 200px"
            default-first-option
            filterable
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <el-upload
        ref="fileUpload"
        class="fileUpload"
        drag
        action=""
        multiple
        :http-request="handleFileUpload"
        accept=".jpg,.png"
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
import { getReimbursementDetail, addReimbursementFile, downloadReimbursementFile, deleteReimbursementFile, setState } from '@/api/reimburse'
export default {
  name: 'ReimburseDetail',
  data() {
    return {
      fileEachPage: 6,
      id: 0,
      invitationSrc: '',
      fileList: [],
      fileType: '银行卡支付记录',
      reimburseInfo: {
        id: -1,
        name: '无报销名！',
        type: '',
        path: '',
        user: null,
        reimbursementFileList: null,
        state: -1
      },
      uploadFileVisible: false,
      uploadType: '',
      acceptFileType: '.jpg,.png',
      updateFileType: '',
      haveMoreFile: false,
      fileMax: 5,
      options: [],
      role: ''
    }
  },
  async created() {
    this.id = this.$route.params.id
    this.role = sessionStorage.getItem('role')
    await getReimbursementDetail(this.id).then(async res => {
      if (res) {
        this.reimburseInfo = res.data
        if (this.reimburseInfo.type === '差旅报销') {
          this.options = [
            {
              label: '车票',
              value: '车票'
            },
            {
              label: '住宿发票',
              value: '住宿发票'
            },
            {
              label: '银行卡支付记录',
              value: '银行卡支付记录'
            }
          ]
        } else if (this.reimburseInfo.type === '国内会议报销') {
          this.options = [
            {
              label: '邀请函',
              value: '邀请函'
            },
            {
              label: '注册费、住宿费发票',
              value: '注册费、住宿费发票'
            },
            {
              label: '银行卡支付记录',
              value: '银行卡支付记录'
            }
          ]
        } else if (this.reimburseInfo.type === '国际会议报销') {
          this.options = [
            {
              label: '邀请函',
              value: '邀请函'
            },
            {
              label: '注册费、住宿费发票',
              value: '注册费、住宿费发票'
            },
            {
              label: '银行卡支付记录',
              value: '银行卡支付记录'
            },
            {
              label: 'ehall因公访问记录',
              value: 'ehall因公访问记录'
            }
          ]
        } else if (this.reimburseInfo.type === '办公用品报销') {
          this.options = [
            {
              label: '发票',
              value: '发票'
            },
            {
              label: '银行卡支付记录',
              value: '银行卡支付记录'
            }
          ]
        } else {
          this.$message.error('未知的报销类型：' + this.reimburseInfo.type + '!')
        }
        // console.log(this.reimburseInfo)
        for (let i = 0; i < this.fileMax && i < res.data.reimbursementFileList.length; i++) {
          await downloadReimbursementFile(res.data.reimbursementFileList[i].id).then(result => {
            const binaryData = [result.data]
            const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.reimbursementFileList[i]) }))
            this.fileList = this.fileList.concat([{
              id: res.data.reimbursementFileList[i].id,
              fileName: res.data.reimbursementFileList[i].fileName,
              description: res.data.reimbursementFileList[i].description,
              url: url
            }])
          })
        }
      }
    }).catch(err => {
      console.log(err)
      this.$message.error('无法获取报销信息')
    })
    this.haveMoreFile = this.fileList.length < this.reimburseInfo.reimbursementFileList.length
  },
  methods: {
    getType(file) {
      let type
      if (file.fileName.split('.').slice(-1)[0] === '.ppt') {
        type = 'application/vnd.ms-powerpoint'
      } else if (file.fileName.split('.').slice(-1)[0] === '.pptx') {
        type = 'application/vnd.openxmlformats-officedoucment.presentationml.presentation'
      } else if (file.fileName.split('.').slice(-1)[0] === '.pdf') {
        type = 'application/pdf'
      } else if (file.fileName.split('.').slice(-1)[0] === '.jpg') {
        type = 'image/jpeg'
      } else if (file.fileName.split('.').slice(-1)[0] === '.png') {
        type = 'image/png'
      }
      return type
    },
    goBack() {
      this.$router.push('/reimburse/index')
    },
    async handleFileUpload(data) {
      // console.log(data)
      const fd = new FormData()
      fd.append('file', data.file)
      fd.append('description', this.fileType)
      const res1 = await addReimbursementFile(this.id, fd)
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
    async getMoreFile() {
      const init = this.fileList.length
      for (let i = init; i < init + this.fileEachPage && i < this.reimburseInfo.reimbursementFileList.length; i++) {
        await downloadReimbursementFile(this.reimburseInfo.reimbursementFileList[i].id).then(result => {
          const binaryData = [result.data]
          const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(this.reimburseInfo.reimbursementFileList[i]) }))
          this.fileList = this.fileList.concat([{
            id: this.reimburseInfo.reimbursementFileList[i].id,
            fileName: this.reimburseInfo.reimbursementFileList[i].fileName,
            description: this.reimburseInfo.reimbursementFileList[i].description,
            url: url
          }])
        })
      }
      this.haveMoreFile = this.fileList.length < this.reimburseInfo.reimbursementFileList.length
      this.fileMax += this.fileEachPage
    },
    downloadFile(file) {
      downloadReimbursementFile(file.id).then(res => {
        const binaryData = [res.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(file) }))
        const a = document.createElement('a')
        a.download = file.fileName
        a.href = url
        a.click()
      })
    },
    deleteFile(file, index) {
      if (this.reimburseInfo.state === -1) {
        deleteReimbursementFile(file.id).then(async res => {
          if (res) {
            this.$notify.success('删除完成！')
            this.fileList.splice(index, 1)
            await this.refreshFileList()
            if (this.reimburseInfo.reimbursementFileList.length <= this.fileMax - this.fileEachPage) {
              this.fileMax -= this.fileEachPage
            }
          }
        }).catch(() => {
          this.$notify.error('删除失败！')
        })
      } else {
        this.$alert('报销已提交，无法删除！')
      }
    },
    async refreshBeforeClose(done) {
      await this.refreshFileList()
      return done(true)
    },
    async refreshFileList() {
      const res = await getReimbursementDetail(this.id)
      if (res) {
        this.reimburseInfo = res.data
      }
      const init = this.fileList.length
      for (var i = init; i < this.fileMax && i < res.data.reimbursementFileList.length; i++) {
        const result = await downloadReimbursementFile(res.data.reimbursementFileList[i].id)
        const binaryData = [result.data]
        const url = window.URL.createObjectURL(new Blob(binaryData, { type: this.getType(res.data.reimbursementFileList[i]) }))
        this.fileList = this.fileList.concat([{
          id: res.data.reimbursementFileList[i].id,
          fileName: res.data.reimbursementFileList[i].fileName,
          description: res.data.reimbursementFileList[i].description,
          url: url
        }])
      }
      this.haveMoreFile = this.fileList.length < this.reimburseInfo.reimbursementFileList.length
    },
    submitReimbursement() {
      setState(this.reimburseInfo.id, 0).then(res => {
        if (res) {
          this.$notify.success('提交成功！')
          this.refreshFileList()
        }
      }).catch(err => {
        this.$notify.error('提交失败!')
        console.log(err)
      })
    },
    admitReimbursement() {
      setState(this.reimburseInfo.id, 1).then(res => {
        if (res) {
          this.$notify.success('已同意报销！')
          this.refreshFileList()
        }
      }).catch(err => {
        this.$notify.error('设置失败!')
        console.log(err)
      })
    },
    rejectReimbursement() {
      setState(this.reimburseInfo.id, 2).then(res => {
        if (res) {
          this.$notify.success('已拒绝报销！')
          this.refreshFileList()
        }
      }).catch(err => {
        this.$notify.error('设置失败!')
        console.log(err)
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

  .reimburseDetailWrap {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .headCard {
    border-radius: 50px;
    min-height: 150px
  }

  .reimburseName {
    margin: 20px auto auto 40px;
    font-size: x-large;
  }

  .reimburseType {
    margin-right: 50px;
    line-height: 20px;
    font-weight: bold;
  }

  .reimburseState {
    margin-right: 20px;
    line-height: 20px;
  }

  .reimburseOtherAttributes {
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
    overflow: hidden;
    width: 48%;
    height: 380px;
  }

  .hoverButtons {
    width: 100%;
    height: 100%;
    background: #000000;
    position: absolute;
    z-index: 2;
    opacity: 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .hoverButtons:hover{
    opacity: 60%;
  }

  .description {
    width: 500px;
    text-align: center;
    margin-top: 50px;
    font-size: 30px;
    color: white;
    height: 36px;
  }

  .hoverBtn {
    height:20%;
    width: 20%;
    margin: 0 5% 5%;
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
    width: 27vw;
  }

  /deep/ .el-upload-dragger {
    width: 27vw;
  }

  .moreFile {
    margin: 1%;
    position: relative;
    display: inline-block;
    overflow: hidden;
    height: 380px;
    width: 48%;
  }

  .moreBtn {
    border: 0;
    height: 100%;
    width: 100%;
  }

  .el-divider--vertical {
    height: 20px;
    line-height: 20px;
    width: 2px;
  }

  .operation {
    float: right;
    width: 120px;
    height: 80px;
    margin: auto 100px 10px auto;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
  }

  .operationButtons {
    margin: 5px;
  }
</style>
