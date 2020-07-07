import axios from '@/utils/request';

// 用户提交/更新绩效申请
export function submitApplication(data) {
  return axios({
    url: '/application',
    method: 'post',
    data
  });
}

// 用户获得已经申请的绩效
export function getUserApplication(page, size) {
  return axios({
    url: '/application/page/' + page + '/' + size,
    method: 'get'
  });
}

// 获取本周是本月第几周
export function getWeek(data) {
  return axios({
    url: '/getdate',
    method: 'post',
    data
  });
}

//  审核人获取待审核绩效
export function getAudit() {
  return axios({
    url: '/pending_audit',
    method: 'get'
  });
}
