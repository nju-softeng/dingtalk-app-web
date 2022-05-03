<template>
  <el-form-item ref="reportUploadComponent" prop="reportFile">
    <span slot="label"> <el-icon class="el-icon-upload" /> 报告上传</span>
    <el-upload
      ref="ReportUpload"
      v-model="innerFile"
      :file-list="fileList"
      class="upload-demo"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      action=""
      :auto-upload="false"
      accept=".doc,.docx,pdf,.md"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <el-tooltip
        class="item"
        effect="dark"
        content="只能上传word/pdf/md文件"
        placement="right"
      >
        <span style="margin-left: 8px"> <svg-icon icon-class="hint" /></span>
      </el-tooltip>
    </el-upload>
  </el-form-item>
</template>

<script>
export default {
  name: 'ProjectReportUpload',
  props: {
    file: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      innerFile: this.file,
      fileList: []
    }
  },
  methods: {
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        // console.log(fileList)
        fileList.splice(0, 1)
      }
      this.innerFile = file
      this.$emit('changeReportFile', file)
      this.$refs['reportUploadComponent'].clearValidate()
      // console.log(this.innerFile)
    },
    handleFileRemove(file, fileList) {
      console.log(fileList)
      this.innerFile = null
      this.$emit('changeReportFile', null)
    },
    handleClose() {
      this.fileList = []
      this.$emit('changeReportFile', null)
    }
  }
}
</script>

<style scoped>

</style>
