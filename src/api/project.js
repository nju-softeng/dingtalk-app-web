import request from "@/utils/request";

export function addProject(data) {
  return request({
    url: "/project",
    method: "post",
    data
  });
}

export function listUnfinishProject(aid) {
  return request({
    url: "/project/unfinish/" + aid,
    method: "get"
  });
}
