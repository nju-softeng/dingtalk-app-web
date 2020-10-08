import axios from "@/utils/request";

// 批量获取周报
export function getDcSummary(date) {
  return axios({
    url: "/dcsummary",
    method: "post",
    data: {
      date: date
    }
  });
}

// 查询用户总AC
export function getAcSummary() {
  return axios({
    url: "/acsummary",
    method: "get"
  });
}

// 查询用户AC变更日志
export function listUserAc(uid) {
  return axios({
    url: "/userac/" + uid,
    method: "get"
  });
}

// 获取最近10条AC 变动公告
export function lastAc() {
  return axios({
    url: "/lastac",
    method: "get"
  });
}

// 获取首页的绩效信息
export function getPerformance() {
  return axios({
    url: "/performance",
    method: "get"
  });
}

// 更新用户指定月份的topup
export function updateTopup(data) {
  return axios({
    url: "/performance/topup",
    method: "post",
    data
  });
}