import * as dd from "dingtalk-jsapi";

dd.config({
  agentId: "", // 必填，微应用ID
  corpId: "", //必填，企业ID
  timeStamp: "", // 必填，生成签名的时间戳
  nonceStr: "", // 必填，生成签名的随机串
  signature: "", // 必填，签名
  type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
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
