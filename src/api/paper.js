import axios from "@/utils/request";

// 添加论文
export function addPaper(data) {
  return axios({
    url: "/paper",
    method: "post",
    data,
  });
}

// 分页查询论文
export function listPaper(page) {
  return axios({
    url: "/paper/page/" + page,
    method: "get",
  });
}

// 获取某个论文的详细信息
export function getPaper(id) {
  return axios({
    url: "/paper/" + id,
    method: "get",
  });
}

// 创建投票
export function createVote(data) {
  return axios({
    url: "/vote",
    method: "post",
    data,
  });
}

// 查询投票详情
export function getVoteDetail(pid) {
  return axios({
    url: "/vote/" + pid + "/detail",
    method: "get",
  });
}

// 用户投票
export function addpoll(vid, data) {
  return axios({
    url: "/vote/" + vid,
    method: "post",
    data,
  });
}

// 提交论文结果
export function submitResult(id, result) {
  return axios({
    url: "/paper_result/" + id,
    method: "post",
    data: {
      data: result,
    },
  });
}

// 删除论文记录
export function rmPaper(id) {
  return axios({
    url: "/paper/delete/" + id,
    method: "get",
  });
}
