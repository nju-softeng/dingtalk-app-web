import Mock from 'mockjs'

export const newsList = Mock.mock({
  'data|1-10': [
    {
      id: '@increment(1)',
      author: '@cname()',
      date: '@date()',
      title: '@cparagraph()',
      'link|+1': ['https://www.baidu.com', 'https://www.hao123.com'],
      'isShown|+1': [0, 1]
    }
  ],
  code: 200,
  message: ''
})

export const newsListWithTotal = Mock.mock({
  data: {
    'newsList|10': [
      {
        id: '@increment(1)',
        author: '@cname()',
        date: '@date()',
        title: '@cparagraph()',
        'link|+1': ['https://www.baidu.com', 'https://www.hao123.com'],
        'isShown|+1': [0, 1]
      }
    ],
    total: 40
  },
  code: 200,
  message: ''
})

export const shownNewsListWithTotal = Mock.mock({
  data: {
    'newsList|10': [
      {
        id: '@increment(1)',
        author: '@cname()',
        date: '@date()',
        title: '@cparagraph()',
        'link|+1': ['https://www.baidu.com', 'https://www.hao123.com'],
        'isShown|+1': [0]
      }
    ],
    total: 40
  },
  code: 200,
  message: ''
})

export const unshownNewsListWithTotal = Mock.mock({
  data: {
    'newsList|10': [
      {
        id: '@increment(1)',
        author: '@cname()',
        date: '@date()',
        title: '@cparagraph()',
        'link|+1': ['https://www.baidu.com', 'https://www.hao123.com'],
        'isShown|+1': [1]
      }
    ],
    total: 40
  },
  code: 200,
  message: ''
})
