import request from "@/utils/request";

export function addProject(data) {
  return request({
    url: "/project",
    method: "post",
    data
  });
}
