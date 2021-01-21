import axios from '@/utils/request'

const api = {
  addPaper: '/paper',
  listPaper: (page, size) => `/paper/page/${page}/${size}`,
  getPaper: id => `/paper/${id}`,
  createVote: '/vote',
  getPaperVote: pid => `/paper/${pid}/vote`,
  getVoteDetailByPid: pid => `/vote/paper/${pid}/detail`,
  getVoteDetailByVid: vid => `/vote/${vid}/detail`,
  addPoll: vid => `/vote/${vid}`

}

// 添加论文
export function addPaper(data) {
  return axios({
    url: api.addPaper,
    method: 'post',
    data
  })
}

// 分页查询论文
export function listPaper(page, size) {
  return axios({
    url: api.listPaper(page, size),
    method: 'get'
  })
}

// 获取某个论文的详细信息
export function getPaper(id) {
  return axios({
    url: api.getPaper(id),
    method: 'get'
  })
}

// 创建投票
export function createVote(data) {
  return axios({
    url: api.createVote,
    method: 'post',
    data
  })
}

// 查询论文对应的投票
export function getPaperVote(pid) {
  return axios({
    url: api.getPaperVote(pid),
    method: 'get'
  })
}

// 更具论文id,查询投票详情
export function getVoteDetailByPid(pid) {
  return axios({
    url: api.getVoteDetailByPid(pid),
    method: 'get'
  })
}

// 更具vid，查询投票详情
export function getVoteDetailByVid(vid) {
  return axios({
    url: api.getVoteDetailByVid(vid),
    method: 'get'
  })
}

// 用户投票
export function addPoll(vid, data) {
  return axios({
    url: api.addPoll(vid),
    method: 'post',
    data
  })
}

// 提交论文结果
export function submitResult(id, result) {
  return axios({
    url: '/paper_result/' + id,
    method: 'post',
    data: {
      data: result
    }
  })
}

// 删除论文记录
export function rmPaper(id) {
  return axios({
    url: '/paper/delete/' + id,
    method: 'get'
  })
}

// 提交论文评审建议
export function submitReview(data) {
  return axios({
    url: '/paper/review',
    method: 'post',
    data
  })
}

// 查询论文评审建议
export function listReview(id) {
  return axios({
    url: '/paper/' + id + '/review',
    method: 'get'
  })
}

export function listExReview(id) {
  return axios({
    url: '/ex-paper/' + id + '/review',
    method: 'get'
  })
}

// 更新论文评审建议
export function updateReview(data, id) {
  return axios({
    url: '/paper/' + id + '/review/update',
    method: 'post',
    data
  })
}

// 删除论文评审
export function deleteReview(id) {
  return axios({
    url: '/paper/review/delete/' + id,
    method: 'get'
  })
}
