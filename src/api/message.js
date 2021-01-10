import axios from '@/utils/request'

// 获取消息
export function getMessages(page, size) {
  return axios({
    url: '/message/page/' + page + '/' + size,
    method: 'get'
  })
}
