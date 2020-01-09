import { login } from "@/api/login";
import { Message } from "element-ui";
// import router, { resetRouter } from "@/router";

const state = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "", // 认证凭证'
  userName: "",
  roles: [],
  introduce: ""
};

const mutations = {
  SET_TOKEN(state, val) {
    state.token = val;
    localStorage.setItem("token", val);
  },
  DEL_TOKEN(state) {
    state.token = "";
    state.userName = "";
    state.roles = "";
    state.introduce = "";
    localStorage.removeItem("token");
  },
  SET_ROLES(state, payload) {
    state.roles = payload;
  },
  SET_NAME(state, payload) {
    state.userName = payload;
  },
  SET_INTRODUCE(state, payload) {
    state.introduce = payload;
  }
};

const actions = {
  // user login
  _login({ commit }, authcode) {
    login(authcode)
      .then(response => {
        if (response.headers["token"] != null) {
          commit("SET_TOKEN", response.headers.token);
          localStorage.setItem("token", response.headers["token"]);
          localStorage.setItem("role", response.headers["role"]);
          localStorage.setItem("uid", response.headers["uid"]);
        }
      })
      .catch(error => {
        console.log(error);
        Message.error("登录失败");
      });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
