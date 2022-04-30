import axios from '@/utils/request'

const api = {
  addPatent: '/patent',
  getPatentList: (page, size) => `/patent/page/${page}/${size}`,
  getPatentDetail: (id) => `/patent/${id}`,
  deletePatent: (id) => `/patent/${id}`,
  decideAudit: (id, isPass) => `/patent/${id}/auditState/${isPass}`,
  decideAuthorization: (id, isPass) => `/patent/${id}/authorizationState/${isPass}`,
  addPatentFile: (id, type) => `/patent/${id}/patentFile/fileType/${type}`,
  deletePatentFile: (id, type) => `/patent/${id}/patentFile/fileType/${type}`,
  downloadPatentFile: (id, type) => `/patent/${id}/patentFile/fileType/${type}`
}

// 添加专利
export function addPatent(data) {
  return axios({
    url: api.addPatent,
    method: 'post',
    data
  })
}

// 获取专利列表
export function getPatentList(page, size) {
  return axios({
    url: api.getPatentList(page, size),
    method: 'get'
  })
}

// 获取专利详情
export function getPatentDetail(id) {
  return axios({
    url: api.getPatentDetail(id),
    method: 'get'
  })
}

// 删除专利
export function deletePatent(id) {
  return axios({
    url: api.deletePatent(id),
    method: 'delete'
  })
}

// 决定内审
export function decideAudit(id, isPass) {
  return axios({
    url: api.decideAudit(id, isPass),
    method: 'put'
  })
}

// 决定授权
export function decideAuthorization(id, isPass) {
  return axios({
    url: api.decideAuthorization(id, isPass),
    method: 'put'
  })
}

// 添加专利文件
export function addPatentFile(id, type, data) {
  return axios({
    url: api.addPatentFile(id, type),
    method: 'post',
    data
  })
}

// 删除专利文件
export function deletePatentFile(id, type) {
  return axios({
    url: api.deletePatentFile(id, type),
    method: 'post'
  })
}

// 下载专利文件
export function downloadPatentFile(id, type) {
  return axios({
    url: api.downloadPatentFile(id, type),
    method: 'get'
  })
}
