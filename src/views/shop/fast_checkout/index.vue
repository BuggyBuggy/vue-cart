<template lang="pug">
    div
      el-main.cart
          el-steps(:active='step', finish-status='success').cart__steps
            el-step(title='表單')
            el-step(title='付款')
          router-view(@setStep='setStep', @keyInDetail='keyInDetail', :details='details', @keyInProduct='keyInProduct', :products='products', @keyInTotalPrice='keyInTotalPrice', :totalPrice='totalPrice', :event_id='event_id')
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Cart',
  data () {
    return {
      step: 1,
      details: {},
      products: [],
      totalPrice: 0,
      event_id: 1
    }
  },
  methods: {
    setStep (step) {
      this.step += step
    },
    keyInDetail (details) {
      this.details = details
    },
    keyInProduct (products) {
      this.products = products
    },
    keyInTotalPrice (totalPrice) {
      this.totalPrice = totalPrice
    }
  },
  mounted () {
    let jsonData = this.$route.query.json ? JSON.parse(this.$route.query.json) : null
    console.log('jsonData', jsonData)
    // let jsonData = {
    //   'event_id': '1',
    //   'product':[
    //     {'g_id': 11, 'g_detail_id': 14, num: 2, price: 228, name: '老媽拌麵-成都擔擔拌麵', type: 'aa', desc: 'aa'},
    //     {'g_id': 5, 'g_detail_id': 8, num: 1, price: 1280, name: '鋼鐵人玩音樂藍牙燈光喇叭', type: 'aa', desc: 'aa'}
    //   ]
    // }
    if(!jsonData || jsonData['product'].length == 0 || !(jsonData['product'][0]['g_detail_id'] && jsonData['product'][0]['num'] && jsonData['product'][0]['price'] && jsonData['product'][0]['type'] && jsonData['product'][0]['name'] && jsonData['product'][0]['desc'])){
      console.log("缺少參數")
      console.log("禁止進入")
      // to do

    }
    this.products = jsonData['product']
    let total = 0;
    jsonData['product'].forEach(v=>{
      total += (v.num * v.price)
    })
    
    this.totalPrice = total
    this.event_id = jsonData['event_id']
  }
}
</script>

<style lang="scss" scoped>
main {
  margin-top: 110px;
}
.cart {
  &__steps {
    position: fixed;
    width: calc(100vw - 40px);
    background: white;
    z-index: 99;
    top: 40px;
    padding-top: 12px;
  }
}
</style>
