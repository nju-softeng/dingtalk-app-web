// 引入mockjs
import Mock from 'mockjs'
// 引入数据
import {
  newsList,
  newsListWithTotal,
  shownNewsListWithTotal,
  unshownNewsListWithTotal
} from './scrollBoardNews.js'

const api = {
  getAllNewsByPage: /api\/news\/page\/(\d+)\/size\/(\d+)$/,
  // type = 0 ：隐藏，type = 1 ：显示
  getNewsBytype1: /api\/news\/type\/1$/,
  getNewsBytype1AndPage: /api\/news\/type\/1\/page\/(\d+)\/size\/(\d+)$/,
  // getNewsBytype1AndPage: "/api/news/type/1/page/1/size/10",
  getNewsBytype0: /api\/news\/type\/0$/,
  getNewsBytype0AndPage: /api\/news\/type\/0\/page\/(\d+)\/size\/(\d+)$/
}

console.log(process.env)
if (process.env.VUE_APP_MOCK === 'true') {
  console.log('wuyu')
  Mock.mock(api.getNewsBytype1, 'get', function(options) {
    console.log(options) // 请求体
    return newsList
  })
  // 分页获取news
  Mock.mock(api.getAllNewsByPage, 'get', function(options) {
    console.log(options) // 请求体
    // console.log("api.getAllNewsByPage");
    return newsListWithTotal
  })

  // 分页获取news, type = 1
  Mock.mock(api.getNewsBytype1AndPage, 'get', function(options) {
    // console.log("api.getNewsBytype1AndPage");
    console.log(options) // 请求体
    return unshownNewsListWithTotal
  })

  // 分页获取news, type = 0
  Mock.mock(api.getNewsBytype0AndPage, 'get', function(options) {
    console.log(options) // 请求体
    // console.log("wu");
    return shownNewsListWithTotal
  })
}
