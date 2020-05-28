import axios from "@/utils/request";

// 测试用户登陆
export function test_login(uid) {
  return axios({
    url: "/login_test/" + uid,
    method: "get"
  });
}

// 用户登录
export function login(data) {
  return axios({
    url: "/login",
    method: "post",
    data
  });
}

// 获取用户信息
export function getInfo() {
  return axios({
    url: "/user/info",
    method: "get"
  });
}

// 获取审核人
export function listAuditors() {
  return axios({
    url: "/user/getAuditors",
    method: "get"
  });
}

// 获取用户本周周报
export function getReport() {
  return axios({
    url: "/report",
    method: "get"
  });
}

// 更新用户权限
export function updateUserRole(data) {
  return axios({
    url: "/updaterole",
    method: "post",
    data
  });
}

// 查询系统中所有用户
export function queryUser(data, page) {
  return axios({
    url: "/user/query/" + page,
    method: "post",
    data
  });
}

// 查询用户详细
export function getUserDetail() {
  return axios({
    url: "/user/detail",
    method: "get"
  });
}