import axios from "axios";
// const url = 'http://34.80.198.150:7777/api/'
const url =
  process.env.NODE_ENV === "production"
    ? "https://shop.tapbee.app/api/"
    : "http://127.0.0.1:7778/api/";
// : 'http://192.168.16.113:7777/api/'

const api = {
  test: url + "goods/listOnMarket",
};

export function getGoods() {
  return axios.post(api.test);
}
