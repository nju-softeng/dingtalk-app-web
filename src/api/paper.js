import axios from "@/utils/request";

// 批量获取周报
export function addPaper(data) {
  return axios({
    url: "/paper",
    method: "post",
    data
  });
}

export function listPaper(page) {
  return axios({
    url: "/paper/page/" + page,
    method: "get"
  });
}

// 获取某个论文的详细信息
export function getPaper(id) {
  return axios({
    url: "/paper/" + id,
    method: "get"
  });
}

export function createVote(data) {
  return axios({
    url: "/vote",
    method: "post",
    data
  });
}

export function getVoteDetail(pid) {
  return axios({
    url: "/vote/" + pid + "/detail",
    method: "get"
  });
}

// 用户投票
export function addpoll(vid, data) {
  return axios({
    url: "/vote/" + vid,
    method: "post",
    data
  });
}

///paper_result/{id}

// 提交论文结果
export function submitResult(id, result) {
  return axios({
    url: "/paper_result/" + id + "/" + result,
    method: "get"
  });
}
