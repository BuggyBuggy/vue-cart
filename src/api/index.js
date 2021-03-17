import axios from 'axios'
// const url = 'http://34.80.198.150:7777/api/'
const url =
  process.env.NODE_ENV === 'production'
    ? 'https://shop.tapbee.app/api/'
    : 'http://127.0.0.1:3002'
// : 'http://192.168.16.113:7777/api/'

const shopApi = {
  list: `${url}/shop/list`
}

const goodApi = {
  list: `${url}/good/list`
}

export function getShops () {
  return axios.post(shopApi.list)
}

export function getGoods () {
  return axios.post(goodApi.list)
}
