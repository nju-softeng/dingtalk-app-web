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
          <img width="50px" src="https://i.loli.net/2021/01/06/gb8fl3B9hwvm2PZ.png">
        </a>
        <p>
          <sub>Vue</sub>
        </p>
      </td>
      <td align="center" valign="middle">
        <a href="https://nginx.org/en/docs/">
          <img width="50px" src="https://i.loli.net/2021/01/06/S3N8E9xHfvb4hsC.png">
        </a>
        <p>
          <sub>Nginx</sub>
        </p>
      </td>
      <td align="center" valign="middle">
        <a href="https://ding-doc.dingtalk.com/doc#/dev/swk0bg" target="_blank">
          <img width="50px" src="https://i.loli.net/2020/11/13/DVpc9nF2JToQyHg.png">
        </a>
        <p>
          <sub>Dingtalk JSAPI</sub>
        </p>
      </td>
      <td align="center" valign="middle">
        <a href="https://docs.docker.com/" target="_blank">
          <img width="50px" src="https://i.loli.net/2020/11/13/27eyNzt698aoilM.png">
        </a>
        <p>
          <sub>Docker</sub>
        </p>
      </td>
      <td align="center" valign="middle">
        <a href="https://docs.docker.com/compose/" target="_blank">
          <img width="50px" src="https://i.loli.net/2020/11/13/TcewOXGMWHLiNtE.jpg">
        </a>
        <p>
          <sub>Docker Compose</sub>
        </p>
      </td>
      <td align="center" valign="middle">
        <a href="https://github.com/features/actions" target="_blank">
          <img width="50px" src="https://i.loli.net/2021/01/06/EcsNSzQZl2TPyB6.png">
        </a>
        <p>
          <sub>Github Actions</sub>
        </p>
      </td>
    </tr>
  </tbody>
</table>

+ jsapi 鉴权部分代码：[dingtalk.js](https://github.com/zhanyeye/dingtalk-vue/blob/master/src/utils/dingtalk.js)

+ 后端代码：[dingtalk-springboot](https://github.com/zhanyeye/dingtalk-springboot)

![dashboard.png](https://i.loli.net/2021/01/11/LaSl2o4r8nNfIce.png)

![application.png](https://i.loli.net/2021/01/11/cR5Is784ijBrGD6.png)

![audit-uncheck.png](https://i.loli.net/2021/01/12/xVZGNgcljkf2EyA.png)

![audit-report.png](https://i.loli.net/2021/01/12/tSKMruUXjiV5Zwo.png)

![audit-next.png](https://i.loli.net/2021/01/12/Xc9RUsIuH7rmYa2.png)

![audit-checked.png](https://i.loli.net/2021/01/12/qtLzCHo8vijuxIf.png)

![dc-performance.png](https://i.loli.net/2021/01/11/FtAC8vXzpsLOd5P.png)

![ac-performance.png](https://i.loli.net/2021/01/11/5feZ8Fq9orXByjW.png)

![dev.png](https://i.loli.net/2021/01/11/dCVWusnbYPhSy6t.png)

![project-detail-1.png](https://i.loli.net/2021/01/11/w8Tr7lUkK1pOaL9.png)

![project-detail-2.png](https://i.loli.net/2021/01/11/UihclBsEJA5wZab.png)

![bug.png](https://i.loli.net/2021/01/11/vDEKX5PjBLq7Vu6.png)

![internal-paper.png](https://i.loli.net/2021/01/11/9DGUjCxaEtwLiXB.png)

![external-paper.png](https://i.loli.net/2021/01/11/q9o5SJebyzXTnxc.png)

![paper-vote.png](https://i.loli.net/2021/01/11/tw93lMKudijVUoC.png)

![paper-review.png](https://i.loli.net/2021/01/11/BOLgIvl83eGtkEp.png)

![sys-user.png](https://i.loli.net/2021/01/12/1m2iSzI7ucEfNOL.png)

![sys-settings.png](https://i.loli.net/2021/01/11/6vDWPdhtonur4Tf.png)

![user.png](https://i.loli.net/2021/01/12/mElirHPOKWTMFfB.png)

<img align="left" width="250" height="auto" src="https://i.loli.net/2020/12/12/j4s6RKzX7JTqyiM.png"/> 
<img align="left" width="250" height="auto" src="https://i.loli.net/2020/12/12/FTiDv3c1HGk5eKM.png"/> 
<img align="center" width="250" height="auto" src="https://i.loli.net/2020/12/12/GqWDFnU4dLmwXa7.png"/> 



参考[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)  
预览 -> https://www.bilibili.com/video/BV1DK411H7Ti/  （早期版本）
