import axios from '@/utils/request'

const api = {
  addSchedule: '/schedule',
  getScheduleList: (page, size) => `/schedule/page/${page}/${size}`,
  deleteSchedule: (id) => `/schedule/${id}`,
  addAbsentOA: (id) => `/schedule/${id}/absentOA`,
  deleteAbsentOA: (id) => `/absentOA/${id}`,
  getAbsentOADetail: (id) => `/schedule/${id}/absentOA`
}

// 添加专利
export function addSchedule(data) {
  return axios({
    url: api.addSchedule,
    method: 'post',
    data
  })
}

// 获取专利列表
export function getScheduleList(page, size) {
  return axios({
    url: api.getScheduleList(page, size),
    method: 'get'
  })
}

// 删除专利
export function deleteSchedule(id) {
  return axios({
    url: api.deleteSchedule(id),
    method: 'delete'
  })
}

// 添加专利文件
export function addAbsentOA(id, data) {
  return axios({
    url: api.addAbsentOA(id),
    method: 'post',
    data
  })
}

// 删除专利文件
export function deleteAbsentOA(id) {
  return axios({
    url: api.deleteAbsentOA(id),
    method: 'delete'
  })
}

export function getAbsentOADetail(id) {
  return axios({
    url: api.getAbsentOADetail(id),
    method: 'get'
  })
}
