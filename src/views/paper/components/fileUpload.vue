<template>
  <el-form-item ref="paperUploadComponent" prop="file">
    <span slot="label"> <el-icon class="el-icon-upload" /> 文件上传</span>
    <el-upload
      ref="PaperUpload"
      v-model="innerFile"
      class="upload-demo"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      action=""
      :auto-upload="false"
      accept=".pdf,.doc,.docx"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <el-tooltip
        class="item"
        effect="dark"
        content="只能上传word/pdf文件"
        placement="right"
      >
        <span style="margin-left: 8px"> <svg-icon icon-class="hint" /></span>
      </el-tooltip>
    </el-upload>
  </el-form-item>
</template>

<script>
export default {
  name: 'FileUpload',
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
      innerFile: this.file
    }
  },
  methods: {
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        console.log(fileList)
        fileList.splice(0, 1)
      }
      this.innerFile = file
      this.$emit('changeFile', file)
      this.$refs['paperUploadComponent'].clearValidate()
      console.log(this.innerFile)
    },
    handleFileRemove(file, fileList) {
      console.log(fileList)
      this.innerFile = null
      this.$emit('changeFile', null)
    }
  }
}
</script>

<style scoped></style>
