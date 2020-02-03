import axios from "@/utils/request";

// 批量获取周报
export function getReportList() {
  return axios({
    url: "/getreportlist",
    method: "get"
  });
}

// 获取单个周报
export function fetchReport(uid, date) {
  return axios({
    url: "/getreport/" + uid,
    method: "post",
    date
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
