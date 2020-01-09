import axios from "@/utils/request";

export function login(data) {
  return axios({
    url: "/login",
    method: "post",
    data
  });
}
