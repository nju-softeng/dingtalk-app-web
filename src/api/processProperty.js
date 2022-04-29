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

// 分页查询会议
export function getProcessProperty(page, size) {
  return axios({
    url: api.getProcessProperty(page, size),
    method: 'get'
  })
}

// 添加会议
export function addProcessProperty(data) {
  return axios({
    url: api.addProcessProperty,
    method: 'post',
    data
  })
}

// 删除会议
export function deleteProcessProperty(id) {
  return axios({
    url: api.deleteProcessProperty(id),
    method: 'delete'
  })
}

// 获取会议详情
export function getProcessPropertyInfo(id) {
  return axios({
    url: api.getProcessPropertyInfo(id),
    method: 'get'
  })
}

// 添加会议文件
export function addProcessFile(id, data) {
  return axios({
    url: api.addProcessFile(id),
    method: 'post',
    data
  })
}

// 下载会议文件
export function downloadProcessFile(id) {
  return axios({
    url: api.downloadProcessFile(id),
    responseType: 'blob',
    method: 'get'
  })
}

// 删除会议文件
export function deleteProcessFile(processId, processFileId, type) {
  return axios({
    url: api.deleteProcessFile(processId, processFileId, type),
    method: 'delete'
  })
}
