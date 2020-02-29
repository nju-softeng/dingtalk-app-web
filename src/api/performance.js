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

export function getAcSummary() {
  return axios({
    url: "/acsummary",
    method: "get"
  });
}

export function listUserAc(uid) {
  return axios({
    url: "/userac/" + uid,
    method: "get"
  });
}
