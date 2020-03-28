import axios from "@/utils/request";

// 查询系统中所有可用用户
export function getUserList() {
  return axios({
    url: "/userlist",
    method: "get"
  });
}

// 钉钉jsapi 鉴权
export function authenticate(url) {
  return axios({
    url: "/jsapi_signature",
    method: "post",
    data: {
      url: url
    }
  });
}
