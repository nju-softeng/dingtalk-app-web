import axios from "@/utils/request";

// 获取单个周报
export function fetchReport(uid, date) {
  return axios({
    url: "/audit/report/" + uid,
    method: "post",
    data: { date: date }
  });
}

// 提交审核结果
export function submitAudit(data) {
  return axios({
    url: "/audit",
    method: "post",
    data
  });
}

// 更新审核结果
export function updateAudit(data) {
  return axios({
    url: "/audit/update",
    method: "post",
    data
  });
}

// 审核人获取已经审核的申请记录
export function getChecked() {
  return axios({
    url: "/audit/checked",
    method: "get"
  });
}

// 更具时间筛选数据
export function getCheckedByDate(date) {
  return axios({
    url: "/audit/checked/date",
    method: "post",
    data: {
      date: date
    }
  });
}

// 审核人获取已经审核的申请记录
export function getToChecked() {
  return axios({
    url: "/audit/pending",
    method: "get"
  });
}

// 审核人待审核申请数
export function getUnCheckCnt() {
  return axios({
    url: "/audit/uncheckcnt",
    method: "get"
  });
}
