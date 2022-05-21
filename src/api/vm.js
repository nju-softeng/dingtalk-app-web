import axios from '@/utils/request'

const api = {
  addVirtualMachineApply: '/vmApply',
  getVMApplyList: (page, size) => `/vmApply/page/${page}/${size}`,
  getAuditingVMApplyList: '/vmApply/auditingList',
  getUserVMApplyList: (uid) => `/vmApply/user/${uid}`,
  setVMApplyResult: (id, data) => `/vmApply/${id}/${data}`,
  deleteVMApply: (id) => `/vmApply/${id}`
}

export function addVirtualMachineApply(data) {
  return axios({
    url: api.addVirtualMachineApply,
    method: 'post',
    data
  })
}

export function getVMApplyList(page, size) {
  return axios({
    url: api.getVMApplyList(page, size),
    method: 'get'
  })
}

export function getAuditingVMApplyList() {
  return axios({
    url: api.getAuditingVMApplyList,
    method: 'get'
  })
}

export function getUserVMApplyList(uid) {
  return axios({
    url: api.getUserVMApplyList(uid),
    method: 'get'
  })
}

export function setVMApplyResult(id, data) {
  return axios({
    url: api.setVMApplyResult(id, data),
    method: 'patch'
  })
}

export function deleteVMApply(id) {
  return axios({
    url: api.deleteVMApply(id),
    method: 'delete'
  })
}
