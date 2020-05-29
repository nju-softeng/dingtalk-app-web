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