
import axios from '@/utils/request'

const api = {
  downloadAcData: (date) => '/excel/ac_data?date=' + date
}

// 下载指定月份的ac汇总
export function downloadAcData(date) {
  return axios.get(api.downloadAcData(date), { responseType: 'blob' })
}
