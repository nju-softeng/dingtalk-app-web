import axios from "@/utils/request";

const api = {
  addPeriod: "/v2/internshipPeriodRecommended",
  getPeriod: "/v2/internshipPeriodRecommended",
};

// 添加推荐实习时间段
export function addPeriod(data) {
  return axios({
    url: api.addPeriod,
    method: "post",
    data,
  });
}

// 添加推荐实习时间段
export function getPeriod() {
  return axios({
    url: api.getPeriod,
    method: "get",
  });
}
