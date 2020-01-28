import axios from "@/utils/request";

// 获取周报
export function getReport() {
  return axios({
    url: "/getreport",
    method: "get"
  });
}

export function submitAudit(data) {
  return axios({
    url: "/audit",
    method: "post",
    data
  });
}
