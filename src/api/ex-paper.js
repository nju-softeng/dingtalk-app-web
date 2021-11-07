import axios from '@/utils/request'

const api = {
  addExPaper: '/ex-paper',
  listExPaper: (page, size) => `/ex-paper/page/${page}/size/${size}`,
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
export function listExPaper(page, size) {
  return axios({
    url: api.listExPaper(page, size),
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

// 查询指定id的论文的投票
export function getExPaperVote(pid) {
  return axios({
    url: '/ex-paper/' + pid + '/vote',
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

// 提交论文结果
export function addExpaperResult(id, data) {
  return axios({
    url: '/ex-paper_result/' + id,
    method: 'post',
    data: data
  })
}
