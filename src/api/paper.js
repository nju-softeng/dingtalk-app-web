import axios from "@/utils/request";

// 批量获取周报
export function addPaper(data) {
  return axios({
    url: "/paper",
    method: "post",
    data
  });
}

export function listPaper() {
  return axios({
    url: "/paper",
    method: "get"
  });
}

export function getPaper(id) {
  return axios({
    url: "/paper/" + id,
    method: "get"
  });
}
