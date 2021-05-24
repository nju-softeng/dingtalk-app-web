import axios from '@/utils/request'

const api = {
  application: '/application',
  listApplication: (page, size) => '/application/page/' + page + '/size/' + size,
  applicationPager: '/application/page/',
  getDate: '/date_code',
  pendingAudit: '/pending_audit',
  getLatestAuditor: '/application/recent_auditor/'
}

// 获取本周是本月第几周
export function getWeek(data) {
  return axios({
    url: api.getDate,
    method: 'post',
    data
  })
}

// 提交新的绩效申请
export function addApplication(data) {
  return axios({
    url: api.application,
    method: 'post',
    data
  })
}

// 提交新的绩效申请
export function updateApplication(id, data) {
  console.log(api.application + '/' + id)
  return axios({
    url: api.application + '/' + id,
    method: 'put',
    data
  })
}


// 用户获得已经申请的绩效
export function listApplication(page, size) {
  return axios({
    url: api.listApplication(page, size),
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




//  审核人获取待审核绩效
export function getAudit() {
  return axios({
    url: api.pendingAudit,
    method: 'get'
  })
}

