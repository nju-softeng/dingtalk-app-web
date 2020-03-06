import axios from "@/utils/request";

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
