// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'

import Shop from './views/shop/index.vue'
import List from './views/shop/_shopId/index.vue'
import GoodDetail from './views/shop/_goodId/index.vue'
import Entry from './views/shop/entry/index.vue'
import Cart from './views/shop/cart/index.vue'
import Payment from './views/shop/cart/payment/index.vue'
import paySuccess from './views/shop/cart/paySuccess/index.vue'
import Detail from './views/shop/cart/detail.vue'

import fast_checkout_Cart from './views/shop/fast_checkout/index.vue'
import fast_checkout_Payment from './views/shop/fast_checkout/payment/index.vue'
import fast_checkout_paySuccess from './views/shop/fast_checkout/paySuccess/index.vue'
import fast_checkout_Detail from './views/shop/fast_checkout/detail.vue'

import Info from './views/shop/cart/info/index.vue'
import PushCart from './views/shop/cart/info/pushCart.vue'

import Order from './views/order/index.vue'
import OrderSingle from './views/order/single.vue'
import OrderList from './views/order/list/index.vue'

import orderWatchLog from './views/order/watchLog/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/shop/entry'
    },
    {
      path: '/shop',
      name: 'shop',
      redirect: '/shop/entry',
      component: Shop,
      children: [
        {
          path: 'entry',
          name: 'entry',
          component: Entry
        },
        {
          path: 'cart',
          name: 'cart',
          component: Cart,
          meta: { title: '購物車' },
          children: [
            {
              name: 'info',
              path: 'info',
              component: Info,
              meta: { title: '購物車' }
            },
            {
              name: 'detail',
              path: 'detail',
              component: Detail,
              meta: { title: '購物車' }
            },
            {
              name: 'payment',
              path: 'payment',
              component: Payment,
              meta: { title: '購物車' }
            },
            {
              name: 'paySuccess',
              path: 'paySuccess',
              component: paySuccess,
              meta: { title: '付款完成' }
            }
          ]
        },
        {
          path: 'fast_checkout',
          name: 'fast_checkout',
          component: fast_checkout_Cart,
          meta: { title: '購物車' },
          children: [
            {
              name: 'fast_checkout_detail',
              path: 'detail',
              component: fast_checkout_Detail,
              meta: { title: '購物車' }
            },
            {
              name: 'fast_checkout_payment',
              path: 'payment',
              component: fast_checkout_Payment,
              meta: { title: '購物車' }
            },
            {
              name: 'fast_checkout_paySuccess',
              path: 'paySuccess',
              component: fast_checkout_paySuccess,
              meta: { title: '付款完成' }
            }
          ]
        },
        {
          path: '/shop/cart/info/:goodId',
          name: 'push_cart',
          component: PushCart,
          meta: { title: '商品資訊' }
        },
        {
          path: '/shop/:shopId',
          name: 'list',
          component: List,
          props: true
        },
        {
          path: '/good/:goodId',
          name: 'GoodDetail',
          component: GoodDetail,
          meta: { title: '商品資訊' },
          props: true
        }
      ]
    },
    {
      path: '/order/OrderSingle/:order_id',
      name: 'OrderSingle',
      component: OrderSingle,
      meta: { title: '訂單明細' }
      // props: true
    },
    {
      path: '/order',
      component: Order,
      redirect: '/order/list',
      children: [
        {
          name: 'orderList',
          path: 'list',
          component: OrderList,
          meta: { title: '訂單明細' }
        },
        {
          name: 'orderWatchLog',
          path: 'orderWatchLog',
          component: orderWatchLog,
          meta: { title: '已查看過' }
        }
      ]
    }
  ]
})
