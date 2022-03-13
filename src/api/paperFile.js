import axios from '@/utils/request'

const api = {
  addPaperFile: (uid, paperId) => `/${uid}/paperFile/${paperId}`,
  getPaperFileInfo: (uid, paperId) => `/${uid}/paperFileInfo/${paperId}`,
  getPaperFileDownloadInfo: (uid, fileId) => `/${uid}/paperFile/${fileId}`
}

// 上传论文文件
export function addPaperFile(uid, paperId, data) {
  return axios({
    url: api.addPaperFile(uid, paperId),
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

// 获取文件的下载信息
export function getPaperFileDownloadInfo(uid, fileId) {
  return axios({
    url: api.getPaperFileDownloadInfo(uid, fileId),
    method: 'get'
  })
}
