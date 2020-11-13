<p align="center">
  <img width="100" src="https://i.loli.net/2020/11/12/8pP5y6eHwX1VfLd.png" alt="logo"></p>
<p align="center">
  <a href="https://github.com/zhanyeye/dingtalk-vue/actions?query=workflow%3AProd">
    <img src="https://github.com/zhanyeye/dingtalk-vue/workflows/Prod/badge.svg" alt="Prod Status">
  </a>
  <a href="https://github.com/zhanyeye/dingtalk-vue/actions?query=workflow%3ATest"> 
    <img src="https://github.com/zhanyeye/dingtalk-vue/workflows/Test/badge.svg">
  </a>
</p>


<h1 align="center">Dingtalk Vue</h1>

## 目标与期望

基于钉钉微应用开发的实验室绩效管理系统，实现实验室的绩效、学分、论文评审管理与钉钉对接。  
主要功能有：绩效、学分申请与审核，论文评审投票及学分管理，项目开发学分管理，实验室助研金计算等。

## 涉及的技术

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://vuejs.org" target="_blank">
          <img width="50px" src="https://vuejs.org/images/logo.png">
        </a>
        <p>Vue</p>
      </td>
      <td align="center" valign="middle">
        <a href="https://nginx.org/en/docs/">
          <img width="50px" src="https://avatars0.githubusercontent.com/u/1412239?s=200&v=4">
        </a>
        <p>Nginx</p>
      </td>
      <td align="center" valign="middle">
        <a href="https://ding-doc.dingtalk.com/doc#/dev/swk0bg" target="_blank">
          <img width="50px" src="https://i.loli.net/2020/11/13/DVpc9nF2JToQyHg.png">
        </a>
        <p>Dingtalk JSAPI</p>
      </td>
      <td align="center" valign="middle">
        <a href="https://docs.docker.com/" target="_blank">
          <img width="50px" src="https://i.loli.net/2020/11/13/27eyNzt698aoilM.png">
        </a>
        <p>Docker</p>
      </td>
      <td align="center" valign="middle">
        <a href="https://docs.docker.com/compose/" target="_blank">
          <img width="50px" src="https://i.loli.net/2020/11/13/TcewOXGMWHLiNtE.jpg">
        </a>
        <p>Docker Compose</p>
      </td>
      <td align="center" valign="middle">
        <a href="https://github.com/features/actions" target="_blank">
          <img width="50px" src="https://avatars0.githubusercontent.com/u/44036562?s=200&v=4">
        </a>
        <p>Github Actions</p>
      </td>
    </tr>
  </tbody>
</table>




参考[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)  
预览 -> https://www.bilibili.com/video/BV1DK411H7Ti/

###### 2020.09.10
修复同时进行多个投票时，没有对websocket传过来的数据进行区分的问题

###### 2020.08.13
使用`docker-compose`代替`docker run`

###### 2020.06.23
更新topup设置; 绩效报表导出execl

###### 2020.06.14
搭建测试环境CD

###### 2020.06.07

引入 markdown 编辑器 [vue-markdown-editor](https://github.com/code-farmer-i/vue-markdown-editor)

###### 2020.04.05

更新 ui，确定 ui 风格

###### 2020.04.02

使用 Github Actions 持续集成服务 [参考](https://segmentfault.com/a/1190000021914414)

###### 2020.03.26

完成功能：钉钉鉴权登陆，绩效审核与申请，绩效汇总，AC 汇总，bug 管理，任务绩效管理，论文管理，内部评审投票
