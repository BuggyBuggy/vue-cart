import Cookies from 'js-cookie'
const order = {
  namespaced: true,
  state: {
    cart: [],
    nowSelectDiscountWay: 0,
    nowInputDiscount: 0
  },
  mutations: {
    addToCart (state, item) {
      // console.log('addToCart, item: ', item)
      state.cart.push(item)
      let length = state.cart.length
      // console.log('state.cart', length)
      Cookies.set('item', length, { domain: '.tapbee.app' })
      // console.log('[addToCart]cookies in vue', Cookies.get('item', { domain: '.tapbee.app' }))
      // Cookies.set('item', length)
      // console.log('state.cart', state.cart)
    },
    removeFromCart (state, id) {
      // ga
      const removeItem = state.cart.find(item => item.g_id === id)
      console.log('removeItem', removeItem)
      trackRemoveFromCart(removeItem.g_id, removeItem.g_name, removeItem.g_type, removeItem.gDt.gDt_desc, removeItem.addCartNum, removeItem.nowOrderPrice)
      // 刪除購物車內的商品
      const romoveIdx = state.cart.findIndex(item => item.g_id === id)
      state.cart.splice(romoveIdx, 1)
      let length = state.cart.length
      Cookies.set('item', length, { domain: '.tapbee.app' })
      // console.log('[removeFromCart]cookies in vue', Cookies.get('item', { domain: '.tapbee.app' }))
      // Cookies.set('item', length)
    },
    updateInfo (state, info) {
      const index = state.cart.findIndex(item => item.g_id === info.g_id)
      // 踩坑紀錄 https://hackmd.io/TE8y7YR-SI2q3bq7_nQmiA
      Object.keys(state.cart[index]).forEach(key => {
        state.cart[index][key] = info[key]
      })
    },
    updateNums (state, { id, nums }) {
      const updateItem = state.cart.find(item => item.g_id === id)
      const index = state.cart.findIndex(item => item.g_id === id)
      // ga
      if (state.cart[index].addCartNum < nums) {
        // 如果原來的購物車數量小於傳過來的數字，代表user加購
        trackAddToCart(updateItem.g_id, updateItem.g_name, updateItem.g_type, updateItem.gDt.gDt_desc, 1, updateItem.nowOrderPrice)
      } else {
        trackRemoveFromCart(updateItem.g_id, updateItem.g_name, updateItem.g_type, updateItem.gDt.gDt_desc, 1, updateItem.nowOrderPrice)
      }
      // update nums
      state.cart[index].addCartNum = nums
    },
    resetCart (state) {
      state.cart = []
      let length = state.cart.length
      Cookies.set('item', length, { domain: '.tapbee.app' })
      // console.log('[resetCart]cookies in vue', Cookies.get('item', { domain: '.tapbee.app' }))
      // Cookies.set('item', length)
    },
    setNowSelectDiscountWay (state, nowSelect) {
      state.nowSelectDiscountWay = Number(nowSelect)
      // console.log('nowSelectDiscountWay', state.nowSelectDiscountWay)
    },
    setNowInputDiscount (state, nowInput) {
      state.nowInputDiscount = Number(nowInput)
      // console.log('nowInputDiscount', state.nowInputDiscount)
    }
  },
  getters: {
    classifiedData (state, getters, rootState, rootGetters) {
      const classifiedData = {}
      for (let i = 0; i < state.cart.length; i++) {
        const shopId = state.cart[i].shop_id
        // console.log('shopId', shopId)
        const shopName = rootGetters.getShopName(shopId)
        // console.log('shopName', shopName)
        if (!classifiedData[shopName]) {
          classifiedData[shopName] = [state.cart[i]]
        } else {
          classifiedData[shopName].push(state.cart[i])
        }
      }
      return classifiedData
      // return state.cart
    },
    itemInCart: (state, getters, rootState, rootGetters) => state.cart.length,
    itemIsInCart: state => id =>
      state.cart.findIndex(item => item.g_id === id) !== -1,
    total: (state, getters, rootState, rootGetters) =>
      state.cart.reduce(
        (accumulator, currentValue, currentIndex) =>
          accumulator + currentValue.g_price * currentValue.addCartNum,
        0
      ) - state.nowInputDiscount
  }
}
export default order
