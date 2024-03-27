import axios from '@/utils/request'

const api = {
  downloadAcData: '/excel/ac_data',
  downloadDcSummaryData: '/excel/dc_summary_data',
  downloadUserPropertyData: '/excel/userProperty_data',
  downloadUserPrizeData: '/excel/userPrize_data'
}

// 下载指定月份的ac汇总
export function downloadAcData(date) {
  return axios.post(api.downloadAcData, date, { responseType: 'blob' })
}

// 下载指定月份的dc汇总
export function downloadDcSummaryData(date) {
  return axios.post(api.downloadDcSummaryData, date, { responseType: 'blob' })
}

// 下载固定资产表格
export function downloadUserPropertyData() {
  return axios({
    url: api.downloadUserPropertyData,
    responseType: 'blob',
    method: 'post'
  })
}

// 下载荣誉资产表格
export function downloadUserPrizeData() {
  return axios({
    url: api.downloadUserPrizeData,
    responseType: 'blob',
    method: 'post'
  })
}
