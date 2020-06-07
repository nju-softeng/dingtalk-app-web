<template>
  <div id="editor">
    <mavon-editor style="height: 100%"></mavon-editor>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "editor",
  components: {
    mavonEditor,
  },
  data() {
    return {
      visible: this.show,
      childData: {},
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
};
</script>
