import axios from '@/utils/request'

const api = {
  getUserPrizes: (uid) => `/users/${uid}/prizes`,
  addPrize: (uid) => `/users/${uid}/prizes`,
  deletePrize: (uid, prizeId) => `/users/${uid}/prizes/${prizeId}`,
  updatePrize: (uid, prizeId) => `/users/${uid}/prizes/${prizeId}`,
  getUserProperties: (uid) => `/user/${uid}/propertyList`,
  addProperties: (uid) => `/user/${uid}/property`,
  deleteProperties: () => `/property`,
  updateProperties: () => `/property/update`
}

// 测试用户登陆
export function test_login(uid) {
  return axios({
    url: '/v2/login_test/' + uid,
    // url: '/login_test/' + uid,
    method: 'get'
  })
}

// 用户登录
export function login(data) {
  return axios({
    url: '/v2/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return axios({
    url: '/user/info',
    method: 'get'
  })
}

// 获取审核人, 用于申请绩效时审核
export function listAuditors() {
  return axios({
    url: '/user/getAuditors',
    method: 'get'
  })
}

// 获取用户本周周报
export function getReport() {
  return axios({
    url: '/report',
    method: 'get'
  })
}

// 更新用户权限
export function updateUserRole(data) {
  return axios({
    url: '/updaterole',
    method: 'post',
    data
  })
}

// 查询系统中所有用户
export function queryUser(data, page) {
  return axios({
    url: '/user/query/' + page,
    method: 'post',
    data
  })
}

// 查询用户详细
export function getUserDetail() {
  return axios({
    url: '/user/detail',
    method: 'get'
  })
}

// 查询用户详细
export function updateUserInfo(data) {
  return axios({
    url: '/user/update',
    method: 'post',
    data
  })
}
// 查询用户奖项
export function getUserPrizes(uid) {
  return axios({
    url: api.getUserPrizes(uid),
    method: 'get'
  })
}
// 新建用户奖项
export function addPrize(uid, data) {
  console.log(api.addPrize(uid))
  return axios({
    url: api.addPrize(uid),
    method: 'post',
    data
  })
}

// 删除用户奖项
export function deletePrize(uid, prizeId) {
  return axios({
    url: api.deletePrize(uid, prizeId),
    method: 'delete'
  })
}

// 修改用户奖项
export function updatePrize(uid, prizeId, data) {
  return axios({
    url: api.updatePrize(uid, prizeId),
    method: 'put',
    data
  })
}

// 查询用户固定资产
export function getUserProperties(uid) {
  return axios({
    url: api.getUserProperties(uid),
    method: 'get'
  })
}

// 新建用户查询用户固定资产
export function addProperty(uid, data) {
  return axios({
    url: api.addProperties(uid),
    method: 'post',
    data
  })
}

// 删除用户查询用户固定资产
export function deleteProperty(propertyId) {
  return axios({
    url: api.deleteProperties(),
    method: 'delete',
    propertyId
  })
}

// 修改用户查询用户固定资产
export function updateProperty(data) {
  return axios({
    url: api.updateProperties(),
    method: 'put',
    data
  })
}

// 上传住房合同
export function updateContract(data) {
  return axios({
    url: '/user/leaseContract',
    method: 'post',
    data
  })
}

// 下载住房合同
export function downloadContract(data) {
  return axios({
    url: '/user/leaseContract',
    responseType: 'blob',
    method: 'get',
    data
  })
}
