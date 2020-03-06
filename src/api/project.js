import request from "@/utils/request";

// 创建项目
export function addProject(data) {
  return request({
    url: "/project",
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
