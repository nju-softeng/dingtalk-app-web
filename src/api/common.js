import axios from "@/utils/request";

// 查询系统中所有可用用户
export function getUserList() {
  return axios({
    url: "/userlist",
    method: "get",
  });
}

// 钉钉jsapi 鉴权
export function authenticate(url) {
  return axios({
    url: "/jsapi_signature",
    method: "post",
    data: {
      url: url,
    },
  });
}

// 从一言 API 获取句子
export function getYiYan() {
  return axios({
    url: "https://v1.hitokoto.cn/?c=i&encode=json",
    method: "get",
  });
}
