<template>
  <div>
    <div class="editor-container">
      <div style=" margin-right:16px">
        <el-avatar></el-avatar>
      </div>
      <div>
        <v-md-editor
          @save="save"
          v-model="value"
          mode="edit"
          height="300px"
          style="width:928px"
        ></v-md-editor>
        <el-button @click="submit" style="margin-top:8px"> 提交</el-button>
      </div>
    </div>

    <div>
      <div class="editor-container">
        <div style=" margin-right:16px; margin-top:24px">
          <el-avatar></el-avatar>
        </div>
        <div style="flex-grow:1">
          <p>xxxxxx xxxx-xx-xx</p>
          <div style="height:200px; background-color:#fff">
            <v-md-editor :value="value" mode="preview"></v-md-editor>
            <div id="content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      html: "",
    };
  },

  created() {
    localStorage.getItem("");
  },
  methods: {
    save() {
      localStorage.setItem("review-content", this.value);
    },
    submit() {
      console.log(this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.editor-container {
  display: flex;
}
</style>
