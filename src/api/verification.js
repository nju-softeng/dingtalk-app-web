import axios from '@/utils/request'

// 验证数据
export function verifyData() {
  return axios({
    url: '/verification',
    method: 'get'
  })
}

// 解决冲突
export function decideConflict(data) {
  return axios({
    url: '/verification',
    method: 'post',
    data
  })
}
