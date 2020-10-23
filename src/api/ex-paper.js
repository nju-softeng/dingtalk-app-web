import axios from '@/utils/request'

const api = {
  addExPaper: '/ex-paper',
  listExPaper: '/ex-paper/list',
  deleteExPaper: '/ex-paper/rm/',
  getExPaper: '/ex-papper/'
}

// 添加外部论文
export function addExReview(data) {
  return axios({
    url: api.addExPaper,
    method: 'post',
    data
  })
}

// 查询所有外部论文
export function listExPaper() {
  return axios({
    url: api.listExPaper,
    method: 'get'
  })
}

// 删除外部论文
export function deleteExPaper(id) {
  return axios({
    url: api.deleteExPaper + id,
    method: 'get'
  })
}

// 查询指定id的论文
export function getExPaper(id) {
  return axios({
    url: api.getExPaper + id,
    method: 'get'
  })
}

