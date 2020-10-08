import request from "@/utils/request";

// 创建项目
export function addBug(data) {
  return request({
    url: "/bug",
    method: "post",
    data
  });
}

// 查询指定项目的bug
export function listProjectBug(pid) {
  return request({
    url: "/bug/project/" + pid,
    method: "get"
  });
}

// 查询审核人创建项目的bug
export function listAuditorBug(aid) {
  return request({
    url: "/bug/auditor/" + aid,
    method: "get"
  });
}

// 确认bug 状态
export function checkBug(data) {
  return request({
    url: "/bug/check",
    method: "post",
    data
  });
}

// 删除bug报告
export function rmBug(id) {
  return request({
    url: "/bug/" + id + "/rm",
    method: "get"
  });
}

// 查询用户的bug
export function listUserBug() {
  return request({
    url: "/bug/user",
    method: "get"
  });
}

// 查询审核人待审核bug数
export function getAuditorBugCnt() {
  return request({
    url: "/bug/aduitor/cnt",
    method: "get"
  });
}
