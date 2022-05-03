<template>
  <el-form-item ref="codeUploadComponent" prop="codeFile">
    <span slot="label"> <el-icon class="el-icon-upload" /> 代码上传</span>
    <el-upload
      ref="CodeUpload"
      v-model="innerFile"
      :file-list="fileList"
      class="upload-demo"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      action=""
      :auto-upload="false"
      accept=".zip,.rar"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <el-tooltip
        class="item"
        effect="dark"
        content="只能上传压缩文件"
        placement="right"
      >
        <span style="margin-left: 8px"> <svg-icon icon-class="hint" /></span>
      </el-tooltip>
    </el-upload>
  </el-form-item>
</template>

<script>
export default {
  name: 'ProjectCodeUpload',
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
      this.$emit('changeCodeFile', file)
      this.$refs['codeUploadComponent'].clearValidate()
      // console.log(this.innerFile)
    },
    handleFileRemove(file, fileList) {
      console.log(fileList)
      this.innerFile = null
      this.$emit('changeCodeFile', null)
    },
    handleClose() {
      this.fileList = []
      this.$emit('changeCodeFile', null)
    }
  }
}
</script>

<style scoped>

</style>
