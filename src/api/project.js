import request from '@/utils/request'

// 创建项目
export function createProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data
  })
}

// 删除项目
export function rmProject(pid) {
  return request({
    url: '/project/' + pid + '/delete',
    method: 'get'
  })
}

// 查询审核人创建的项目
export function listProject() {
  return request({
    url: '/project',
    method: 'get'
  })
}

// 查询实验室所有项目
export function listAllProject() {
  return request({
    url: '/project/all',
    method: 'get'
  })
}

// 查询项目详情
export function getProjectDetail(pid) {
  return request({
    url: 'project/' + pid + '/detail',
    method: 'get'
  })
}

// 查询项目所包含的迭代
export function listProjectIteration(pid) {
  return request({
    url: 'project/' + pid + '/iteration',
    method: 'get'
  })
}

// 创建迭代
export function createIteration(pid, data) {
  return request({
    url: '/project/' + pid + '/iteration',
    method: 'post',
    data
  })
}

// 删除迭代
export function rmIteration(itid) {
  return request({
    url: '/project/iteration/' + itid + '/delete',
    method: 'get'
  })
}

// 查询迭代绩效
export function computeIterateAc(itid, date) {
  return request({
    url: '/project/iteration/' + itid + '/computeac',
    method: 'post',
    data: {
      finishdate: date
    }
  })
}

// 系统计算迭代AC
export function autoSetAc(itid, date) {
  return request({
    url: '/project/autosetac/' + itid,
    method: 'post',
    data: {
      finishdate: date
    }
  })
}

// 手动设置迭代AC
export function manualSetAc(itid, data) {
  return request({
    url: '/project/manualsetac/' + itid,
    method: 'post',
    data
  })
}

// 获取迭代
export function getIteration(id) {
  return request({
    url: '/project/iteration/' + id,
    method: 'get'
  })
}

// 查询用户参与的迭代
export function listUserIteration() {
  return request({
    url: '/project/iteration/user',
    method: 'get'
  })
}
