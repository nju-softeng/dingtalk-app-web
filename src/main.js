import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "@/icons"; // icon
import "@/permission"; // permission control

import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import "@/styles/element-variables.scss";

import * as filters from "./filters"; // global filters

import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";

import "./mock";

VueMarkdownEditor.use(vuepressTheme);

Vue.use(VueMarkdownEditor);

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "mini",
});

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
