import axios from "@/utils/request";

// 批量获取周报
export function getMessages(page, size) {
  return axios({
    url: "/message/page/" + page + "/" + size,
    method: "get"
  });
}
