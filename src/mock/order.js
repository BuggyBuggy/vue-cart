import Mock from 'mockjs'

const MockData = Mock.mock({
  'list|5-20': [
    {
      'id|10000-99999': 100,
      name: '@cname',
      address: '@province' + '@city' + '@county',
      tel: /^09\d{8}/,
      mail: '@email',
      'list|1-10': [{ name: '@ctitle', nums: '@natural(60, 100)' }],
      total: '@natural(600, 10000)',
      status: /[0-2]/
    }
  ]
})
const getList = config => {
  MockData.list.sort((a, b) => a.status - b.status)
  return MockData
}
export default {
  getList
}
