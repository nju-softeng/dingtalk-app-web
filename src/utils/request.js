import axios from "axios";
import bus from "@/utils/bus";

axios.defaults.baseURL = "/api";
axios.interceptors.request.use(
  function(req) {
    req.headers.token = sessionStorage.getItem("token");
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
    bus.$emit(bus.e, error.response.data.message);
    return Promise.reject(error);
  }
);

export default axios;
