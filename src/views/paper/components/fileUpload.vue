<template>
  <div>
    <el-upload
      ref="internalPaperUpload"
      class="upload-demo"
      :on-change="handlePaperChange('internal')"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传word/pdf文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: ['file'],
  data() {
    return {
      fileList: {}
    }
  }
}
</script>

<style scoped>

</style>
