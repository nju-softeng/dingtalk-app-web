import axios from '@/utils/request'

const api = {
  fetchReport: '/audit/report/',
  submitAudit: '/audit',
  checkedPager: '/audit/checked/page/',
  checkedByDate: '/audit/checked/date',
  pendingAudit: '/audit/pending',
  uncheckCnt: '/audit/uncheck_cnt'
}

// 获取单个周报
export function fetchReport(uid, date) {
  console.log("LLLLLL" + date)
  return axios({
    url: api.fetchReport + uid,
    method: 'post',
    data: date
  })
}

// 提交/更新 审核结果
export function submitAudit(data) {
  return axios({
    url: api.submitAudit,
    method: 'post',
    data
  })
}

// 审核人获取已经审核的申请记录
export function getChecked(page) {
  return axios({
    url: api.checkedPager + page,
    method: 'get'
  })
}

// 更具时间筛选数据
export function getCheckedByDate(date) {
  return axios({
    url: api.checkedByDate,
    method: 'post',
    data: date
  })
}

// 审核人获取待审核的申请记录
export function getToChecked() {
  return axios({
    url: api.pendingAudit,
    method: 'get'
  })
}

// 审核人待审核申请数
export function getUnCheckCnt() {
  return axios({
    url: api.uncheckCnt,
    method: 'get'
  })
}
