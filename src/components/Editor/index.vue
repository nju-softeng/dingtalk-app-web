<template>
  <div id="editor">
    <mavon-editor style="height: 100%" />
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "Editor",
  components: {
    mavonEditor,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.show,
      childData: {},
    };
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
};
</script>
