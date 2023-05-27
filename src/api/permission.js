import axios from '@/utils/request'

const api = {
  getPersonalPermissions: '/v2/permission',
  getOthersPermissions: (userId) => '/v2/permission/' + userId,
  updateUserPermissionList: '/v2/userPermission/batch'
}

export function getPersonalPermissions() {
  return axios({
    url: api.getPersonalPermissions,
    method: 'get'
  })
}

export function getOthersPermissions(userId) {
  return axios({
    url: api.getOthersPermissions(userId),
    method: 'get'
  })
}

export function updateUserPermissionList(userPermissionList) {
  return axios({
    url: api.updateUserPermissionList,
    method: 'post',
    data: userPermissionList
  })
}
