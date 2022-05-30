import axios from '@/utils/request'

const api = {
  addDissertation: '/dissertation',
  getDissertationInfo: (page, size) => `/dissertation/page/${page}/${size}`,
  getDissertationDetail: (uid) => `/${uid}/dissertation`,
  addDissertationFile: (id) => `/dissertation/${id}`,
  deleteDissertationFile: (id, type) => `/dissertation/${id}/file/${type}`,
  downloadDissertationFile: (id, type) => `/dissertation/${id}/fileType/${type}`
}

// 添加毕业论文
export function addDissertation(data) {
  return axios({
    url: api.addDissertation,
    method: 'post',
    data
  })
}

// 查询所有毕业论文
export function getDissertationInfo(page, size) {
  return axios({
    url: api.getDissertationInfo(page, size),
    method: 'get'
  })
}

// 查询个人毕业论文
export function getDissertationDetail(uid) {
  return axios({
    url: api.getDissertationDetail(uid),
    method: 'get'
  })
}

// 上传毕业论文文件
export function addDissertationFile(id, data) {
  return axios({
    url: api.addDissertationFile(id),
    method: 'post',
    data
  })
}

// 删除毕业论文文件
export function deleteDissertationFile(id, type) {
  return axios({
    url: api.deleteDissertationFile(id, type),
    method: 'delete'
  })
}

// 下载毕业论文文件
export function downloadDissertationFile(id, type) {
  return axios({
    url: api.downloadDissertationFile(id, type),
    method: 'post',
    responseType: 'blob'
  })
}
