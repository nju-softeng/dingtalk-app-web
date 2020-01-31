# dingtalk-vue



###### API 及传输数据的结构体

+ 审核人获取已经审核的绩效申请

  ```json
  // 返回结构体
  [{
      "name": "xxx",
      "dcRecord": {
          "id": 1,
          "dvalue": 0.5,
          "cvalue": 0.6,
          "dc": 0.3,
          "ac": 1.0,
          "yearmonth": 202001,
          "week": 1,
          
      },
      "acItems": [
          {
              "reason": "xxxx",
              "ac": 1.0
          }
      ]
  }]
  ```

+ 审核人修改已经审核的绩效申请





+ 解决分页 -> [link](https://juejin.im/post/5c388bd151882524ed5b9f2a)
