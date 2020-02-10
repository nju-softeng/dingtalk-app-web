import axios from "@/utils/request";

// 批量获取周报
export function getUserList() {
  return axios({
    url: "/userlist",
    method: "get"
  });
}
