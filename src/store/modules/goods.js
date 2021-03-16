import { getGoods } from '@/api/index'
const goods = {
  namespaced: true,
  state: {
    goods: [],
    useCoupon: false,
    useActivityTicket: false
  },
  mutations: {
    setGoods (state, data) {
      state.goods = data
    },
    setUseActivityTicket (state, useActivityTicket) {
      // useActivityTicket : 0->此商品沒有綁定『活動購物金』, 其他->商品的活動ID,有綁定『活動購物金』
      if (useActivityTicket !== 0) {
        state.useActivityTicket = true
      }
      // console.log('state.useActivityTicket', state.useActivityTicket)
    },
    setUseActivityTicketFalse (state, useActivityTicket) {
      if (useActivityTicket !== 0) {
        state.useActivityTicket = false
      }
      // console.log('state.useActivityTicket', state.useActivityTicket)
    }
  },
  getters: {
    classifiedData (state) {
      const classifiedData = {}
      for (let i = 0; i < state.goods.length; i++) {
        const shopId = state.goods[i].shop_id
        if (!classifiedData[shopId]) {
          classifiedData[shopId] = [state.goods[i]]
        } else {
          classifiedData[shopId].push(state.goods[i])
        }
      }
      return classifiedData
    },
    getGoods: (state, getters) => shopId => getters.classifiedData[shopId],
    getRestNums: (state, getters, rootState, rootGetters) => (
      shopId,
      itemId
    ) => {
      // console.log('itemId', itemId)
      // console.log('getters.classifiedData[shopId]', getters.classifiedData[shopId])
      // const originNums = getters.classifiedData[shopId].find(
      //   item => `${item.g_id}_${item.good_detail_id}` === itemId
      // ).g_nums
      const itemInCart = rootState.cart.cart.find(item => item.g_id === itemId)
      let itemInCartNums = 0
      // if (itemInCart) itemInCartNums = itemInCart.g_nums
      if (itemInCart) itemInCartNums = itemInCart.addCartNum
      // console.log('originNums', originNums)
      // console.log('itemInCartNums', itemInCartNums)
      // return originNums - itemInCartNums
      return itemInCartNums
    },
    getMaxNums: (state, getters) => (shopId, itemId) =>
      getters.classifiedData[shopId].find(item => `${item.g_id}_${item.good_detail_id}` === itemId).g_nums
  },
  actions: {
    fetchGoods ({ commit }) {
      return getGoods().then(res => {
        commit('setGoods', res.data.data)
      })
    }
  }
}

export default goods
