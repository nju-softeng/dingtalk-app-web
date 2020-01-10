import { login, getInfo } from "@/api/login";
//import { Message } from "element-ui";
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
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
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
    return new Promise((resolve, reject) => {
      login(authcode)
        .then(response => {
          if (response.headers["token"] != null) {
            commit("SET_TOKEN", response.headers.token);
            localStorage.setItem("token", response.headers["token"]);
            resolve();
            console.log("response.headers[token]" + response.headers["token"]);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // get user info
  _getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }
          console.log(data);
          const { name, avatar } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
