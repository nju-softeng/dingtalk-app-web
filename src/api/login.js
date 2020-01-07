import axios from "@/utils/request";

export function login(code) {
  axios.post("/login", code).then(response => {
    let token = response.headers["token"];
    console.log("tokenis" + token);
    let role = response.headers["role"];
    let uid = response.headers["uid"];
    if (token != null) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("uid", uid);
      //alert(uid);
      //window.location.href = "./index.html";
    }
  });
}
