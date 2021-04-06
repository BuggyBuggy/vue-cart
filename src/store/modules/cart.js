const order = {
  namespaced: true,
  state: {
    cart: [],
    nowSelectDiscountWay: 0,
    nowInputDiscount: 0
  },
  mutations: {
    addToCart (state, item) {
      state.cart.push(item)
    },
    removeFromCart (state, id) {
      // 刪除購物車內的商品
      const romoveIdx = state.cart.findIndex(item => item.g_id === id)
      state.cart.splice(romoveIdx, 1)
    },
    updateInfo (state, info) {
      const index = state.cart.findIndex(item => item.g_id === info.g_id)
      // 踩坑紀錄 https://hackmd.io/TE8y7YR-SI2q3bq7_nQmiA
      Object.keys(state.cart[index]).forEach(key => {
        state.cart[index][key] = info[key]
      })
    },
    updateNums (state, { id, nums }) {
      const index = state.cart.findIndex(item => item.g_id === id)
      // update nums
      state.cart[index].addCartNum = nums
    },
    resetCart (state) {
      state.cart = []
    },
    setNowSelectDiscountWay (state, nowSelect) {
      state.nowSelectDiscountWay = Number(nowSelect)
    },
    setNowInputDiscount (state, nowInput) {
      state.nowInputDiscount = Number(nowInput)
    }
  },
  getters: {
    classifiedData (state, getters, rootState, rootGetters) {
      const classifiedData = {}
      for (let i = 0; i < state.cart.length; i++) {
        const shopId = state.cart[i].shop_id
        const shopName = rootGetters.getShopName(shopId)
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
