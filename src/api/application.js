import axios from "@/utils/request";

// 用户提交绩效申请
export function submitApplication(data) {
  return axios({
    url: "/application",
    method: "post",
    data
  });
}

export function updateApplication(data) {
  return axios({
    url: "/application/update",
    method: "post",
    data
  });
}

export function getAcItem(id) {
  return axios({
    url: "/application/" + id,
    method: "get"
  });
}

// 用户获得已经申请的绩效
export function getUserApplication(page) {
  return axios({
    url: "/application/page/" + page,
    method: "get"
  });
}

// 获取本周是本月第几周
export function getWeek(data) {
  return axios({
    url: "/getdate",
    method: "post",
    data
  });
}

//  审核人获取待审核绩效
export function getAudit() {
  return axios({
    url: "/pending_audit",
    method: "get"
  });
}
