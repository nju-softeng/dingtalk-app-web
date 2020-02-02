import axios from "@/utils/request";

// 获取周报
export function getReportList() {
  return axios({
    url: "/getreportlist",
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

export function updateAudit(data) {
  return axios({
    url: "/updateAudit",
    method: "post",
    data
  });
}

export function getChecked() {
  return axios({
    url: "/checked",
    method: "get"
  });
}

export function getReport(data) {
  return axios({
    url: "report",
    method: "post",
    data
  });
}
