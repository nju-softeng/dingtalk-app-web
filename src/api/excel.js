
import axios from '@/utils/request'

const api = {
  downloadAcData: '/excel/ac_data'
}

// 下载指定月份的ac汇总
export function downloadAcData(date) {
  return axios.post(api.downloadAcData, date, { responseType: 'blob' })
}
