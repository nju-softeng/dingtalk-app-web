import axios from "axios";
import { Message } from "element-ui";

axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
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
    console.log(error.response.data);
    console.log("err:" + error); // for debug
    Message({
      message: error.response.data.message,
      type: "error",
      duration: 8 * 1000
    });
    return Promise.reject(error);
  }
);

export default axios;
