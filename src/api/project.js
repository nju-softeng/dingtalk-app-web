import request from "@/utils/request";

// 创建项目
export function createProject(data) {
  return request({
    url: "/project",
    method: "post",
    data
  });
}

// 删除项目
export function rmProject(pid) {
  return request({
    url: "/project/" + pid + "/delete",
    method: "get"
  });
}

// 查询审核人创建的项目
export function listProject() {
  return request({
    url: "/project",
    method: "get"
  });
}

// 查询实验室所有项目
export function listAllProject() {
  return request({
    url: "/project/all",
    method: "get"
  });
}

// 查询项目详情
export function getProjectDetail(pid) {
  return request({
    url: "project/" + pid + "/detail",
    method: "get"
  });
}

// 查询项目所包含的迭代
export function listProjectIteration(pid) {
  return request({
    url: "project/" + pid + "/iteration",
    method: "get"
  });
}

// 创建迭代
export function createIteration(pid, data) {
  return request({
    url: "/project/" + pid + "/iteration",
    method: "post",
    data
  });
}

// 删除迭代
export function rmIteration(itid) {
  return request({
    url: "/project/iteration/" + itid + "/delete",
    method: "get"
  });
}

// 查询迭代绩效
export function computeIterateAc(itid, date) {
  return request({
    url: "/project/iteration/" + itid + "/computeac",
    method: "post",
    data: {
      finishdate: date
    }
  });
}

// 系统计算迭代AC
export function autoSetAc(itid, date) {
  return request({
    url: "/project/autosetac/" + itid,
    method: "post",
    data: {
      finishdate: date
    }
  });
}

// 手动设置迭代AC
export function manualSetAc(itid, data) {
  return request({
    url: "/project/manualsetac/" + itid,
    method: "post",
    data
  });
}

// 获取迭代
export function getIteration(id) {
  return request({
    url: "/project/iteration/" + id,
    method: "get"
  });
}

// 查询用户参与的迭代
export function listUserIteration() {
  return request({
    url: "/project/iteration/user",
    method: "get"
  });
}

// // 更新项目
// export function updateProject(data) {
//   return request({
//     url: "/project/update",
//     method: "post",
//     data
//   });
// }

// // 审核人查询进行中的项目
// export function listUnfinishProject(aid) {
//   return request({
//     url: "/project/unfinish/" + aid,
//     method: "get"
//   });
// }

// // 审核人查询进行中的项目
// export function listfinishProject(aid) {
//   return request({
//     url: "/project/finish/" + aid,
//     method: "get"
//   });
// }

// // 审核人删除项目
// export function deleteProject(id) {
//   return request({
//     url: "/project/delete/" + id,
//     method: "get"
//   });
// }

// // 获取项目期间的dc
// export function getProjectDc(pid, date) {
//   return request({
//     url: "/project/dc/" + pid,
//     method: "post",
//     data: {
//       finishdate: date
//     }
//   });
// }

// // 获取项目期间的ac
// export function computeProjectAc(pid, date) {
//   return request({
//     url: "/project/computeac/" + pid,
//     method: "post",
//     data: {
//       finishdate: date
//     }
//   });
// }

// export function manualSetAc(pid, data) {
//   return request({
//     url: "/project/manualsetac/" + pid,
//     method: "post",
//     data
//   });
// }

// export function listDevProject() {
//   return request({
//     url: "/project/dev",
//     method: "get"
//   });
// }
