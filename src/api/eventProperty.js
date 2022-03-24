import axios from '@/utils/request'

const api = {
  listEvent: (page, size) => `/event/page/${page}/${size}`,
  addEvent: '/event',
  deleteEvent: (id) => `/event/${id}`
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
    url: api.deleteEvent,
    method: 'delete'
  })
}
