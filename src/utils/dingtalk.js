import * as dd from "dingtalk-jsapi/entry/union";
import requestAuthCode from "dingtalk-jsapi/api/runtime/permission/requestAuthCode";
import { authenticate } from "@/api/common";

function dingtalkconfig(url) {
  authenticate(url).then(res => {
    dd.config({
      agentId: res.data.agentId, // 必填，微应用ID
      corpId: res.data.corpId, //必填，企业ID
      timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      type: 0,
      jsApiList: [
        "runtime.info",
        "biz.contact.choose",
        "device.notification.confirm",
        "device.notification.alert",
        "device.notification.prompt",
        "biz.ding.post",
        "biz.util.openLink"
      ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    });
  });
}

// 通讯录选人
export function contactChoose(url) {
  dingtalkconfig(url);
  return dd.biz.contact.choose({
    multiple: true, //是否多选：true多选 false单选； 默认true
    corpId: "dingeff939842ad9207f35c2f4657eb6378f", //企业id
    max: 10 //人数限制，当multiple为true才生效，可选范围1-1500
  });
}

// 获取登陆用临时授权码
export function getAuthCode(corpId) {
  return dd.runtime.permission.requestAuthCode({ corpId: corpId });
}
