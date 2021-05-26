import {
  authenticate
} from '@/api/common' // jsapi 鉴权时获取签名信息
import * as dd from 'dingtalk-jsapi/entry/union' // 按需应用，微应用部分
import requestAuthCode from 'dingtalk-jsapi/api/runtime/permission/requestAuthCode' // 登陆用临时授权码
import choose from 'dingtalk-jsapi/api/biz/contact/choose' // PC 通讯录选人
import downloadFile from 'dingtalk-jsapi/api/biz/util/downloadFile' // 钉钉下载文件

/**
 * 鉴权
 * @param url 前端当前的url
 */
function ddconfig(url) {
  return authenticate(url).then(res => {
    dd.config({
      agentId: res.data.agentId, // 必填，微应用ID
      corpId: res.data.corpId, // 必填，企业ID
      timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      type: 0,
      jsApiList: [
        'runtime.info',
        'biz.contact.choose',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.ding.post',
        'biz.util.openLink'
      ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    })
  })
}

// 通讯录选人
export function contactChoose(url, userids) {
  return new Promise((resolve, reject) => {
    ddconfig(url)
      .then(() => {
        choose({
          users: userids,
          multiple: true, // 是否多选：true多选 false单选； 默认true
          corpId: process.env.VUE_APP_CORPID, // 企业id
          max: 10 // 人数限制，当multiple为true才生效，可选范围1-1500
        }).then(res => {
          res = JSON.parse(JSON.stringify(res).replace(/emplId/g, 'userid'))
          resolve(res)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 获取登陆用临时授权码
export function getAuthCode(corpId) {
  return requestAuthCode({
    corpId: corpId
  })
}

export function downloadFileByDingTalk(url, fileName) {
  return downloadFile({
    url: url,
    name: fileName
  })
}
