import request from "@/utils/request";

// 创建项目
export function addBug(data) {
  return request({
    url: "/bug",
    method: "post",
    data
  });
}

export function listProjectBug(pid) {
  return request({
    url: "/bug/project/" + pid,
    method: "get"
  });
}
