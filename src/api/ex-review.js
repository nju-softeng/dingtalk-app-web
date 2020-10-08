import axios from '@/utils/request'

const api = {
  addExReview: '/ex-review',
  listExReview: '/ex-review/list'
}

// 添加外部评审
export function addExReview(data) {
  return axios({
    url: api.addExReview,
    method: 'post',
    data
  })
}

// 查询所有外部评审
export function listExReview() {
  return axios({
    url: api.listExReview,
    method: 'get'
  })
}
