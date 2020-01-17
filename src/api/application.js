import axios from "@/utils/request";

// 用户提交绩效申请
export function submitApplication(data) {
  return axios({
    url: "/application",
    method: "post",
    data
  });
}

export function getUserApplication(uid, page) {
  return axios({
    url: "/application/" + uid + "/page=" + page,
    method: "get"
  });
}
