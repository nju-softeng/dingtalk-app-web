import axios from "@/utils/request";

const api = {
  addReimbursement: "/reimburse",
  getReimbursementList: (page, size) => `/reimburse/page/${page}/${size}`,
  getReimbursementDetail: (id) => `/reimburse/${id}`,
  deleteReimbursement: (id) => `/reimbursement/${id}`,
  setState: (id, state) => `/reimburse/${id}/state/${state}`,
  addReimbursementFile: (id) => `/reimburse/${id}/reimbursementFile`,
  deleteReimbursementFile: (id) => `/reimbursementFile/${id}`,
  downloadReimbursementFile: (id) => `/reimbursementFile/${id}`,
  queryReimbursementList: (page, size) => `/v2/reimbursement/${page}/${size}`,
};

// 添加专利
export function addReimbursement(data) {
  return axios({
    url: api.addReimbursement,
    method: "post",
    data,
  });
}

// 获取专利列表
export function getReimbursementList(page, size) {
  return axios({
    url: api.getReimbursementList(page, size),
    method: "get",
  });
}

// 获取专利详情
export function getReimbursementDetail(id) {
  return axios({
    url: api.getReimbursementDetail(id),
    method: "get",
  });
}

// 删除专利
export function deleteReimbursement(id) {
  return axios({
    url: api.deleteReimbursement(id),
    method: "delete",
  });
}

export function setState(id, state) {
  return axios({
    url: api.setState(id, state),
    method: "put",
  });
}

// 添加专利文件
export function addReimbursementFile(id, data) {
  return axios({
    url: api.addReimbursementFile(id),
    method: "post",
    data,
  });
}

// 删除专利文件
export function deleteReimbursementFile(id) {
  return axios({
    url: api.deleteReimbursementFile(id),
    method: "delete",
  });
}

export function downloadReimbursementFile(id) {
  return axios({
    url: api.downloadReimbursementFile(id),
    responseType: "blob",
    method: "get",
  });
}

export function queryReimbursementList(page, size, payload) {
  return axios({
    url: api.queryReimbursementList(page, size),
    method: "post",
    data: payload,
  });
}
