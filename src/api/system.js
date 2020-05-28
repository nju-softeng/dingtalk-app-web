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