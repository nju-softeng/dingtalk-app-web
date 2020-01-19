import axios from "@/utils/request";

// 用户提交绩效申请
export function submitApplication(data) {
  return axios({
    url: "/application",
    method: "post",
    data
  });
}

// 用户获得已经申请的绩效
export function getUserApplication(uid, page) {
  return axios({
    url: "/application/" + uid + "/page=" + page,
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
