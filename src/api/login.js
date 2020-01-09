import axios from "@/utils/request";

export function login(data) {
  return axios({
    url: "/login",
    method: "post",
    data
  });
}

export function getInfo() {
  return axios({
    url: "/user/info",
    method: "get"
  });
}
