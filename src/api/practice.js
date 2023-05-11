import axios from "@/utils/request";

const api = {
  addPractice: "/practice",
  getPracticeList: "/practice",
  deletePractice: (id) => `/practice/${id}`,
  queryPracticeList: (page, size) => `/v2/practice/${page}/${size}`,
  addPracticeV2: "/v2/practice",
  modifyPractice: "/v2/practice",
};

// 添加专利
export function addPractice(data) {
  return axios({
    url: api.addPractice,
    method: "post",
    data,
  });
}

// 获取专利列表
export function getPracticeList() {
  return axios({
    url: api.getPracticeList,
    method: "get",
  });
}

// 删除专利
export function deletePractice(id) {
  return axios({
    url: api.deletePractice(id),
    method: "delete",
  });
}

export function queryPracticeList(page, size, payload) {
  return axios({
    url: api.queryPracticeList(page, size),
    method: "post",
    data: payload,
  });
}

export function addPracticeV2(data) {
  return axios({
    url: api.addPracticeV2,
    method: "post",
    data,
  });
}

export function modifyPractice(data) {
  return axios({
    url: api.modifyPractice,
    method: "put",
    data,
  });
}
