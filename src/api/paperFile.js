import axios from '@/utils/request'

const api = {
  addPaperFile: (uid, paperId) => `/${uid}/paperFile/${paperId}`,
  addExternalPaperFile: (uid, paperId) => `/${uid}/ex-paperFile/${paperId}`,
  getPaperFileInfo: (uid, paperId) => `/${uid}/paperFileInfo/${paperId}`,
  getExternalPaperFileInfo: (uid, paperId) => `/${uid}/ex-paperFileInfo/${paperId}`,
  getPaperFileDownloadInfo: (uid, fileId) => `/${uid}/paperFile/${fileId}`,
  deletePaperFile: (uid, paperId, fileId) => `/${uid}/paper/${paperId}/paperFile/${fileId}`,
  deleteExternalPaperFile: (uid, paperId, fileId) => `/${uid}/ex-paper/${paperId}/ex-paperFile/${fileId}`
}

// 上传论文文件
export function addPaperFile(uid, paperId, data) {
  return axios({
    url: api.addPaperFile(uid, paperId),
    method: 'post',
    data
  })
}

// 上传外部论文文件
export function addExternalPaperFile(uid, paperId, data) {
  return axios({
    url: api.addExternalPaperFile(uid, paperId),
    method: 'post',
    data
  })
}

// 获取一个论文下的所有文件
export function getPaperFileInfo(uid, paperId) {
  return axios({
    url: api.getPaperFileInfo(uid, paperId),
    method: 'get'
  })
}

// 获取一个外部论文下的所有文件
export function getExternalPaperFileInfo(uid, paperId) {
  return axios({
    url: api.getExternalPaperFileInfo(uid, paperId),
    method: 'get'
  })
}

// 获取文件的下载信息
export function getPaperFileDownloadInfo(uid, fileId) {
  return axios({
    url: api.getPaperFileDownloadInfo(uid, fileId),
    method: 'get'
  })
}

// 删除论文文件
export function deletePaperFile(uid, paperId, fileId, data) {
  return axios({
    url: api.deletePaperFile(uid, paperId, fileId),
    method: 'delete',
    data
  })
}

// 删除外部论文文件
export function deleteExternalPaperFile(uid, paperId, fileId, data) {
  return axios({
    url: api.deleteExternalPaperFile(uid, paperId, fileId),
    method: 'delete',
    data
  })
}
