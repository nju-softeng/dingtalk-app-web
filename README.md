<p align="center">
  <img width="100" src="https://i.loli.net/2020/11/12/8pP5y6eHwX1VfLd.png" alt="logo">
  <h2 align="center">Dingtalk App Web</h2>
  <p align="center">
    <a href="https://www.codefactor.io/repository/github/nju-softeng/dingtalk-app-web/overview/main"><img src="https://www.codefactor.io/repository/github/nju-softeng/dingtalk-app-web/badge/main" alt="CodeFactor" /></a>
    <a href="https://github.com/nju-softeng/dingtalk-app-web/actions?query=workflow%3AMain"> 
      <img src="https://github.com/nju-softeng/dingtalk-app-web/actions/workflows/main.yml/badge.svg?branch=main">
    </a>
    <a href="https://github.com/nju-softeng/dingtalk-app-web/actions?query=workflow%3ARelease">
      <img src="https://github.com/nju-softeng/dingtalk-app-web/actions/workflows/release.yml/badge.svg?branch=release">
    </a>
  </p>
</p>



### 目标与期望

基于钉钉微应用开发的实验室绩效管理系统，实现实验室的绩效、学分、论文评审管理与钉钉对接。  
主要功能：绩效、学分申请与审核，论文评审投票及学分管理，项目开发学分管理，实验室助研金计算等。

### 涉及的技术

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

+ jsapi 鉴权部分代码：[dingtalk.js](https://github.com/nju-softeng/dingtalk-app-web/blob/main/src/utils/dingtalk.js)

+ 后端代码：[dingtalk-springboot](https://github.com/nju-softeng/dingtalk-app-server)

![01](https://user-images.githubusercontent.com/35565811/147812078-ee6d23d6-183b-46ee-9cab-fa511a9db3e1.png)
![02](https://user-images.githubusercontent.com/35565811/147812086-3de4a6d8-0951-45fa-b954-012c1bdecf0e.png)
![03](https://user-images.githubusercontent.com/35565811/147812088-b7efadb5-4cb7-492b-8b91-3fdcf1d45f33.png)
![04](https://user-images.githubusercontent.com/35565811/147812093-98630a58-0f5c-4f57-b004-e63d017ad573.png)
![05](https://user-images.githubusercontent.com/35565811/147812102-c0d0771b-5260-4475-89fe-6a5ca2e70bc5.png)
![06](https://user-images.githubusercontent.com/35565811/147812111-2b46366e-be0a-4ab1-9790-32e8346afccc.png)
![07](https://user-images.githubusercontent.com/35565811/147812115-381fe5c5-5090-44ba-8adb-fe4126f702b8.png)
![08](https://user-images.githubusercontent.com/35565811/147812121-983cac86-4d19-42c8-8c79-d72117603c46.png)
![09](https://user-images.githubusercontent.com/35565811/147812126-3a237f3d-3305-4428-b9f2-7ad2b36075eb.png)
![10](https://user-images.githubusercontent.com/35565811/147812129-0294e664-6eed-46cf-b04e-128b153b974d.png)
![11](https://user-images.githubusercontent.com/35565811/147812136-f8fea23c-0d52-4af9-a017-cc8cfaf2b4aa.png)
![12](https://user-images.githubusercontent.com/35565811/147812141-fcc1ba3f-5b27-4c92-b311-148117e31aef.png)
![13](https://user-images.githubusercontent.com/35565811/147812148-e3b09cc8-3499-402b-b45c-087d2651b205.png)
![14](https://user-images.githubusercontent.com/35565811/147812150-7f8a93a7-a6b8-4e73-82ab-24d17210b46c.png)
![15](https://user-images.githubusercontent.com/35565811/147812155-ad4aadc4-9e23-4595-983e-7f648cd888cc.png)
![16](https://user-images.githubusercontent.com/35565811/147812167-b1e5ee61-550b-49fe-be29-75db3e656a8c.png)
![17](https://user-images.githubusercontent.com/35565811/147812171-74e74dc2-a89e-4efe-9792-32894b697004.png)
![18](https://user-images.githubusercontent.com/35565811/147812176-5587bd9a-8297-43bf-9941-64204d07f6e6.png)
![19](https://user-images.githubusercontent.com/35565811/147812180-e26104c1-cff6-4faa-b190-bffc4e793b43.png)



![project-detail-1.png](https://i.loli.net/2021/01/11/w8Tr7lUkK1pOaL9.png)

![project-detail-2.png](https://i.loli.net/2021/01/11/UihclBsEJA5wZab.png)

![bug.png](https://i.loli.net/2021/01/11/vDEKX5PjBLq7Vu6.png)



|                                                        |                                                        |                                                        |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| <img src="https://i.loli.net/2020/12/12/j4s6RKzX7JTqyiM.png"/> | <img src="https://i.loli.net/2020/12/12/FTiDv3c1HGk5eKM.png"/> | <img src="https://i.loli.net/2020/12/12/GqWDFnU4dLmwXa7.png"/> |

  

参考[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)  
