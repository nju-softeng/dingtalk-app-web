import axios from '@/utils/request'

const api = {
  addProjectProperty: '/projectProperty',
  deleteProjectProperty: (id) => `/projectProperty/${id}`,
  getProjectPropertyList: (page, size) => `/projectProperty/page/${page}/${size}`,
  getProjectPropertyDetail: (id) => `/projectProperty/${id}`,
  addProjectPropertyVersion: (id) => `/projectProperty/${id}/projectPropertyVersion`,
  updateProjectPropertyVersion: (id) => `/projectPropertyVersion/${id}`,
  deleteProjectPropertyVersion: (id) => `/projectPropertyVersion/${id}`,
  addProjectPropertyFile: (id, type) => `/projectPropertyFile/${id}/fileType/${type}`,
  deleteProjectPropertyFile: (id, type) => `/projectPropertyFile/${id}/fileType/${type}`,
  downloadProjectPropertyFile: (id, type) => `/projectPropertyFile/${id}/fileType/${type}`
}

// 添加项目
export function addProjectProperty(data) {
  return axios({
    url: api.addProjectProperty,
    method: 'post',
    data
  })
}

// 删除项目
export function deleteProjectProperty(id) {
  return axios({
    url: api.deleteProjectProperty(id),
    method: 'delete'
  })
}

export function getProjectPropertyList(page, size) {
  return axios({
    url: api.getProjectPropertyList(page, size),
    method: 'get'
  })
}

export function getProjectPropertyDetail(id) {
  return axios({
    url: api.getProjectPropertyDetail(id),
    method: 'get'
  })
}

export function addProjectPropertyVersion(id, data) {
  return axios({
    url: api.addProjectPropertyVersion(id),
    method: 'post',
    data
  })
}

export function updateProjectPropertyVersion(id, data) {
  return axios({
    url: api.updateProjectPropertyVersion(id),
    method: 'put',
    data
  })
}

export function deleteProjectPropertyVersion(id) {
  return axios({
    url: api.deleteProjectPropertyVersion(id),
    method: 'delete'
  })
}

export function addProjectPropertyFile(id, type, data) {
  return axios({
    url: api.addProjectPropertyFile(id, type),
    method: 'post',
    data
  })
}

export function deleteProjectPropertyFile(id, type) {
  return axios({
    url: api.deleteProjectPropertyFile(id, type),
    method: 'delete'
  })
}

export function downloadProjectPropertyFile(id, type) {
  return axios({
    url: api.downloadProjectPropertyFile(id, type),
    responseType: 'blob',
    method: 'get'
  })
}
