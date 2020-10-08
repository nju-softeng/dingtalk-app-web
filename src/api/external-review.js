import axios from '@/utils/request'

// 添加外部评审
export function addExReview(data) {
  return axios({
    url: '/paper',
    method: 'post',
    data
  })
}

// // 更新外部评审
// export function addPaper(data) {
//     return axios({
//         url: '/paper',
//         method: 'post',
//         data
//     })
// }
//
//
// // 删除外部评审
// export function listPaper(page, size) {
//   return axios({
//     url: '/paper/page/' + page + '/' + size,
//     method: 'get'
//   })
// }
//
//
// // 查询外部评审
// export function listPaper(page, size) {
//     return axios({
//         url: '/paper/page/' + page + '/' + size,
//         method: 'get'
//     })
// }
