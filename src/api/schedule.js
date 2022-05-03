import axios from '@/utils/request'

const api = {
  addSchedule: '/schedule',
  getScheduleList: (page, size) => `/schedule/page/${page}/${size}`,
  deleteSchedule: (id) => `/schedule/${id}`,
  addAbsentOA: (id) => `/schedule/${id}/absentOA`,
  deleteAbsentOA: (id) => `/absentOA/${id}`,
  getAbsentOADetail: (id) => `/schedule/${id}/absentOA`
}

export function addSchedule(data) {
  return axios({
    url: api.addSchedule,
    method: 'post',
    data
  })
}

export function getScheduleList(page, size) {
  return axios({
    url: api.getScheduleList(page, size),
    method: 'get'
  })
}

export function deleteSchedule(id) {
  return axios({
    url: api.deleteSchedule(id),
    method: 'delete'
  })
}

export function addAbsentOA(id, data) {
  return axios({
    url: api.addAbsentOA(id),
    method: 'post',
    data
  })
}

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
