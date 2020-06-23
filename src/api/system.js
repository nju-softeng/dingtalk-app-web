import axios from "@/utils/request";

// 查询系统中所有用户
export function queryUser(data, page) {
  return axios({
    url: "/system/user/" + page,
    method: "post",
    data
  });
}

// 拉取用户
export function fetchAllUser() {
  return axios({
    url: "/system/fetchuser",
    method: "get"
  });
}

// 查询所有绩效标准
export function listSubsidy() {
  return axios({
    url: "/system/subsidy",
    method: "get"
  });
}

// 更新绩效标准
export function updateSubsidy(data) {
  return axios({
    url: "/system/subsidy",
    method: "post",
    data
  });
}

// 查询所有的论文AC标准
export function listPaperLevel() {
  return axios({
    url: "/system/paperlevel",
    method: "get"
  });
}

// 更新论文绩效标准
export function updatePaperLevel(data) {
  return axios({
    url: "/system/paperlevel",
    method: "post",
    data
  });
}

// 更新论文绩效标准
export function updateUserInfo(data) {
  return axios({
    url: "/system/userinfo",
    method: "post",
    data
  });
}

// 禁用用户
export function disableUser(uid) {
  return axios({
    url: "/system/disable/user/" + uid,
    method: "get"
  });
}

// 启用用户
export function enableUser(uid) {
  return axios({
    url: "/system/enable/user/" + uid,
    method: "get"
  });
}

// 查询禁用的用户
export function queryDisableUser() {
  return axios({
    url: "/system/query/disableuser",
    method: "get"
  });
}