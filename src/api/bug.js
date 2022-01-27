import request from "@/utils/request";

const api = {
  addBug: "/bug",
  listProjectBug: "/bug/project/",
  listAuditorBug: "/bug/auditor/",
  checkBug: "/bug/check",
  rmBug: "/bug/rm/",
  listUserBug: "/bug/user",
  getAuditorBugCnt: "/bug/aduitor/cnt",
};

// 创建项目
export function addBug(data) {
  return request({
    url: api.addBug,
    method: "post",
    data,
  });
}

// 查询指定项目的bug
export function listProjectBug(pid) {
  return request({
    url: api.listProjectBug + pid,
    method: "get",
  });
}

// 查询审核人创建项目的bug
export function listAuditorBug(aid) {
  return request({
    url: api.listAuditorBug + aid,
    method: "get",
  });
}

// 确认bug 状态
export function checkBug(data) {
  return request({
    url: api.checkBug,
    method: "post",
    data,
  });
}

// 删除bug报告
export function rmBug(id) {
  return request({
    url: api.rmBug + id,
    method: "get",
  });
}

// 查询用户的bug
export function listUserBug() {
  return request({
    url: this.listUserBug,
    method: "get",
  });
}

// 查询审核人待审核bug数
export function getAuditorBugCnt() {
  return request({
    url: api.getAuditorBugCnt,
    method: "get",
  });
}
