import axios from '@/utils/request'

const api = {
  listEvent: (page, size) => `/event/page/${page}/${size}`,
  addEvent: '/event',
  deleteEvent: (id) => `/event/${id}`,
  getEventInfo: (id) => `/event/${id}`,
  addEventPropertyFile: (id) => `/event/${id}/eventFile`,
  downloadEventFile: (id) => `/eventFile/${id}`,
  deleteEventPropertyFile: (eventId, eventFileId, type) => `/event/${eventId}/eventFile/${eventFileId}/eventFileType/${type}`
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

export function downloadEventFile(id) {
  return axios({
    url: api.downloadEventFile(id),
    responseType: 'blob',
    method: 'get'
  })
}

// 删除文件
export function deleteEventPropertyFile(eventId, eventFileId, type) {
  return axios({
    url: api.deleteEventPropertyFile(eventId, eventFileId, type),
    method: 'delete'
  })
}
