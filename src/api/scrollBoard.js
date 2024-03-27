import axios from '@/utils/request'

const api = {
  // getAllNewsByPage: (page, size) => "/news/page/" + page + "/size/" + size,
  // // type = 0 ：隐藏，type = 1 ：显示
  // getNewsBytype: (type) => "/news/type/" + type,
  // getNewsBytypeAndPage: (type, page, size) =>
  //   "/news/type/" + type + "/page/" + page + "/size/" + size,
  // deleteNews: (newsId) => "/news/" + newsId,
  // addNews: "/news",
  // // 改变新闻的显示类型（隐藏/显示）
  // changeNewsType: (newsId) => "/news/" + newsId,

  getAllNewsByPage: (page, size) => '/v2/news/AllNews/' + page + '/' + size,
  getShownNewsByPage: (page, size) => '/v2/news/shownNews/' + page + '/' + size,
  getShownNews: '/v2/news/shownNews/',
  getNotShownNewsByPage: (page, size) =>
    '/v2/news/notShownNews/' + page + '/' + size,
  hideNews: (newsId) => '/v2/news/shownNews/' + newsId,
  showNews: (newsId) => '/v2/news/notShownNews/' + newsId,
  deleteNews: (newsId) => '/v2/news/' + newsId,
  addNews: '/v2/news'
}

// export function getNewsBytype(type) {
//   return axios({
//     url: api.getNewsBytype(type),
//     method: "get",
//   });
// }

// export function getNewsByPage(page, size) {
//   return axios({
//     url: api.getAllNewsByPage(page, size),
//     method: "get",
//   });
// }

// export function getNewsBytypeAndPage(type, page, size) {
//   return axios({
//     url: api.getNewsBytypeAndPage(type, page, size),
//     method: "get",
//   });
// }

export function addNews(title, authorId, content) {
  return axios({
    url: api.addNews,
    method: 'post',
    data: {
      title,
      authorId,
      content
    }
  })
}

export function deleteNews(newsId) {
  return axios({
    url: api.deleteNews(newsId),
    method: 'delete'
  })
}

export function hideNews(newsId) {
  return axios({
    url: api.hideNews(newsId),
    method: 'put'
  })
}

export function showNews(newsId) {
  return axios({
    url: api.showNews(newsId),
    method: 'put'
  })
}

export function getAllNewsByPage(page, size) {
  return axios({
    url: api.getAllNewsByPage(page, size),
    method: 'get'
  })
}

export function getShownNewsByPage(page, size) {
  return axios({
    url: api.getShownNewsByPage(page, size),
    method: 'get'
  })
}

export function getShownNews() {
  return axios({
    url: api.getShownNews,
    method: 'get'
  })
}

export function getNotShownNewsByPage(page, size) {
  return axios({
    url: api.getNotShownNewsByPage(page, size),
    method: 'get'
  })
}

// export function changeNewsType(newsId) {
//   return axios({
//     url: api.changeNewsType(newsId),
//     method: "put",
//   });
// }
