import request from "@/utils/request";

// 创建项目
export function addProject(data) {
  return request({
    url: "/project",
    method: "post",
    data
  });
}

// 更新项目
export function updateProject(data) {
  return request({
    url: "/project/update",
    method: "post",
    data
  });
}

// 审核人查询进行中的项目
export function listUnfinishProject(aid) {
  return request({
    url: "/project/unfinish/" + aid,
    method: "get"
  });
}

// 审核人查询进行中的项目
export function listfinishProject(aid) {
  return request({
    url: "/project/finish/" + aid,
    method: "get"
  });
}

// 审核人删除项目
export function deleteProject(id) {
  return request({
    url: "/project/delete/" + id,
    method: "get"
  });
}

// 获取项目期间的dc
export function getProjectDc(pid, date) {
  return request({
    url: "/project/dc/" + pid,
    method: "post",
    data: {
      finishdate: date
    }
  });
}

// 获取项目期间的ac
export function computeProjectAc(pid, date) {
  return request({
    url: "/project/computeac/" + pid,
    method: "post",
    data: {
      finishdate: date
    }
  });
}

export function autoSetAc(pid, date) {
  return request({
    url: "/project/autosetac/" + pid,
    method: "post",
    data: {
      finishdate: date
    }
  });
}

export function manualSetAc(pid, data) {
  return request({
    url: "/project/manualsetac/" + pid,
    method: "post",
    data
  });
}
