import axios from '@/utils/request'

const api = {
  listEvent: (page, size) => `/event/page/${page}/${size}`,
  addEvent: '/event',
  deleteEvent: (id) => `/event/${id}`,
  getEventInfo: (id) => `/event/${id}`,
  addEventPropertyFile: (id) => `/event/${id}/eventFile`
}

// 分页查询活动
export function listEvent(page, size) {
  return axios({
    url: api.listEvent(page, size),
    method: 'get'
  })
}

// 添加活动
export function addEvent(data) {
  return axios({
    url: api.addEvent,
    method: 'post',
    data
  })
}

// 删除活动
export function deleteEvent(id) {
  return axios({
    url: api.deleteEvent(id),
    method: 'delete'
  })
}

export function getEventInfo(id) {
  return axios({
    url: api.getEventInfo(id),
    method: 'get'
  })
}

export function addEventPropertyFile(id, data) {
  return axios({
    url: api.addEventPropertyFile(id),
    method: 'post',
    data
  })
}
