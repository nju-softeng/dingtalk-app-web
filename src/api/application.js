import axios from '@/utils/request'

const api = {
  application: '/application',
  applicationPager: '/application/page/',
  getDate: '/getdate',
  pendingAudit: '/pending_audit',
  getLatestAuditor: '/application/latestAuditor/'
}

// 用户提交/更新绩效申请
export function submitApplication(data) {
  return axios({
    url: api.application,
    method: 'post',
    data
  })
}

// 用户获得已经申请的绩效
export function getUserApplication(page, size) {
  return axios({
    url: api.applicationPager + page + '/' + size,
    method: 'get'
  })
}

// 获取本周是本月第几周
export function getWeek(data) {
  return axios({
    url: api.getDate,
    method: 'post',
    data
  })
}

//  审核人获取待审核绩效
export function getAudit() {
  return axios({
    url: api.pendingAudit,
    method: 'get'
  })
}

// 查询申请人最近一次绩效申请的审核人是谁
export function getLatestAuditor(uid) {
  return axios({
    url: api.getLatestAuditor + uid,
    method: 'get'
  })
}
