import axios from "@/utils/request";

// 批量获取周报
export function getUserList() {
  return axios({
    url: "/userlist",
    method: "get"
  });
}

export function authenticate(url) {
  return axios({
    url: "/jsapi_signature",
    method: "post",
    data: {
      url: url
    }
  });
}
