import axios from "@/utils/request";

export function getYiYan(type) {
  if (type === undefined) {
    type = "f";
  }
  return axios({
    url: "https://v1.hitokoto.cn/?c=" + type + "&encode=json",
    method: "get"
  });
}
