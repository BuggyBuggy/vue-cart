import Vue from 'vue'
import Vuex from 'vuex'
import goods from './modules/goods'
import cart from './modules/cart'
import createPersistedState from 'vuex-persistedstate'
import { getShops } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    cart,
    goods
  },
  state: {
    employeeID: null,
    shops: []
  },
  mutations: {
    setEmployeeID (state, id) {
      state.employeeID = id
    },
    setShops (state, shops) {
      this.state.shops = shops
    }
  },
  actions: {
    fetchShops ({ commit }) {
      return getShops().then(res => {
        // console.log('getShops', res)
        commit('setShops', res.data.data)
      })
    }
  },
  getters: {
    getShopName (state) {
      return id => {
        const idx = state.shops.findIndex(shop => shop.shop_id === id)
        // console.log('state.shops', state.shops)
        // console.log('state', state)
        // console.log('idx', idx)
        return state.shops[idx].name
      }
    }
  }
})
