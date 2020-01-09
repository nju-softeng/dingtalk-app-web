import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.headers.common["Content-Type"] =
  "application/json;charset=UTF-8";
axios.interceptors.request.use(
  function(req) {
    req.headers.token = sessionStorage.getItem("token"); // 请求头部添加token
    return req;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default axios;
