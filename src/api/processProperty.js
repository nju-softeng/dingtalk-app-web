import axios from '@/utils/request'

const api = {
  getProcessProperty: (page, size) => `/process/page/${page}/${size}`,
  addProcessProperty: '/process',
  deleteProcessProperty: (id) => `/process/${id}`,
  getProcessPropertyInfo: (id) => `/process/${id}`,
  addProcessFile: (id) => `/process/${id}`,
  downloadProcessFile: (id) => `/processFile/${id}`,
  deleteProcessFile: (processId, processFileId, type) => `/process/${processId}/processFile/${processFileId}/processFileType/${type}`
}

// 分页查询活动
export function getProcessProperty(page, size) {
  return axios({
    url: api.getProcessProperty(page, size),
    method: 'get'
  })
}

// 添加活动
export function addProcessProperty(data) {
  return axios({
    url: api.addProcessProperty,
    method: 'post',
    data
  })
}

// 删除活动
export function deleteProcessProperty(id) {
  return axios({
    url: api.deleteProcessProperty(id),
    method: 'delete'
  })
}

export function getProcessPropertyInfo(id) {
  return axios({
    url: api.getProcessPropertyInfo(id),
    method: 'get'
  })
}

export function addProcessFile(id, data) {
  return axios({
    url: api.addProcessFile(id),
    method: 'post',
    data
  })
}

export function downloadProcessFile(id) {
  return axios({
    url: api.downloadProcessFile(id),
    responseType: 'blob',
    method: 'get'
  })
}

// 删除文件
export function deleteProcessFile(processId, processFileId, type) {
  return axios({
    url: api.deleteProcessFile(processId, processFileId, type),
    method: 'delete'
  })
}
