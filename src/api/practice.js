import axios from '@/utils/request'

const api = {
  addPractice: '/practice',
  getPracticeList: '/practice',
  deletePractice: (id) => `/practice/${id}`
}

// 添加专利
export function addPractice(data) {
  return axios({
    url: api.addPractice,
    method: 'post',
    data
  })
}

// 获取专利列表
export function getPracticeList() {
  return axios({
    url: api.getPracticeList,
    method: 'get'
  })
}

// 删除专利
export function deletePractice(id) {
  return axios({
    url: api.deletePractice(id),
    method: 'delete'
  })
}
