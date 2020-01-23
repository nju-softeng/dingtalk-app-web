import axios from "@/utils/request";

// 获取周报
export function getReport() {
  return axios({
    url: "/getreport",
    method: "get"
  });
}
