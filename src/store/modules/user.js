import { login, getInfo } from "@/api/user";
import { test_login } from "@/api/user"; //测试登陆
import { getavatar } from "@/utils/initavatar";

//import router, { resetRouter } from "@/router";

const state = {
  token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "", // 认证凭证'
  name: "",
  uid: "",
  roles: [],
  avatar: "",
  introduce: ""
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
    sessionStorage.setItem("token", token);
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
    sessionStorage.setItem("avatar", avatar);
  },
  SET_UID: (state, uid) => {
    state.uid = uid;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_NAME: (state, name) => {
    state.name = name;
    sessionStorage.setItem("name", name);
  },
  SET_INTRODUCE: (state, payload) => {
    state.introduce = payload;
  },
  DEL_TOKEN: state => {
    state.token = "";
    state.name = "";
    state.roles = "";
    state.introduce = "";
    sessionStorage.removeItem("token");
  }
};

function getRoles(role) {
  if (role === "6983f953b49c88210cb9") {
    return "admin"; // 老师，超级管理员
  } else if (role === "bb63e5f7e0f2ffae845c") {
    return "postgraduate"; // 研究生
  } else {
    return "doctor"; // 博士生，管理员
  }
}

const actions = {
  // user login
  _login({ commit }, authcode) {
    console.log("action login");
    return new Promise((resolve, reject) => {
      login(authcode)
        .then(response => {
          if (response.headers["token"] != null) {
            commit("SET_TOKEN", response.headers.token);
            commit("SET_UID", response.headers.uid);

            sessionStorage.setItem("token", response.headers["token"]); // 登录成功后将token存储在sessionStorage中
            sessionStorage.setItem("role", getRoles(response.headers["role"]));
            sessionStorage.setItem("uid", response.headers["uid"]);
            resolve();
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // get user info
  _getInfo({ commit, state }) {
    console.log("action getInfo");
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) reject("Verification failed, please Login again.");
          if (data.avatar == "") {
            console.log("avatar is null");
            data.avatar = getavatar(data.name);
          }
          commit("SET_NAME", data.name);
          commit("SET_AVATAR", data.avatar);
          commit("SET_ROLES", sessionStorage.getItem("role"));
          resolve();
        })
        .catch(error => {
          console.log("getinfo error");
          reject(error);
        });
    });
  },

  test_login({ commit }, uid) {
    console.log("test login");
    return new Promise((resolve, reject) => {
      test_login(uid)
        .then(response => {
          if (response.headers["token"] != null) {
            commit("SET_TOKEN", response.headers.token);
            sessionStorage.setItem("token", response.headers["token"]); // 登录成功后将token存储在sessionStorage中
            sessionStorage.setItem("role", getRoles(response.headers["role"]));
            console.log(sessionStorage.getItem("role"));
            sessionStorage.setItem("uid", response.headers["uid"]);
            resolve();
          }
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
