<template lang="pug">
    div(v-if="cart.length")
      slot
      div(v-for='shopName in shopListInCart' :key='shopName')
        .shopName {{shopName}}
        InfoItem( v-for="(item,idx) in classifiedData[shopName]" :item="item"  :key='item.g_id' @removeCart="removeCart" @showCoupon="isShowCoupon" )
      .cart__footer
        div
          Ticket(:isShow="ticketShow" :use_ticket="use_ticket" @return_user_has_ticket="return_user_has_ticket" :key="reRenderCount" )  
        el-col(:span="18") 金額：$ {{priceFormat}}
        el-col(:span="6")
          router-link(:to={name:'detail'})
            el-button(type="primary" style="float:right; margin:14px 0;" @click="nextStep" :disabled='disabled') 下一步
    div.empty(v-else)
      h1 你的購物車沒有商品
      //- el-button(type="warning"  @click="goBack" )  趕緊選購
      //- el-button(type="warning"  @click="$router.go(-1)" )  趕緊選購
      div(@click="goBack")
        el-button(type="warning")  趕緊選購
</template>

<script>
import InfoItem from './InfoItem'
import Ticket from './Ticket'

import { mapGetters, mapState, mapMutations } from 'vuex'
export default {
  name: 'CartInfo',
  data() {
    return {
      couponShow: false,
      use_coupon: false,
      use_ticket: false,
      reRenderCount: 0,
      user_has_ticket: false,
      user_has_coupon: false,
      // showCoupon: false

      // 新
      ticketShow: false,
    }
  },
  created(){
    this.shopListInCart
    this.reRenderCoupon()
    // this.isShowCoupon();
  },
  beforeUpdate(){    
    // this.couponShow = false
            // this.hasUseCoupon()
    // this.hasUseTicket()
    // this.isShowCoupon()

  },
  computed: {
    ...mapState('cart', ['cart', 'nowInputDiscount']),
    ...mapGetters('cart', ['classifiedData', 'total', 'itemInCart']), 
    disabled () {
      return !this.itemInCart
    },
    shopListInCart () {
      // alert('a')
     
      // return this.classifiedData
      return Object.keys(this.classifiedData)
    },
    priceFormat: function(){
        // this.total = this.total-this.nowInputDiscount
        return ( this.total || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
  },
  components: {
    InfoItem,
    // Coupon,
    Ticket
  },
  methods: {
    return_user_has_ticket (boolean) {
      // console.log(boolean)
      if(this.user_has_ticket !== boolean){
        this.user_has_ticket = boolean;
        this.isShowCoupon()
      }
    },
    return_user_has_coupon (boolean) {
      // console.log(boolean)
      if(this.user_has_coupon !== boolean){
        this.user_has_coupon = boolean;
        this.isShowCoupon()
      }
    },
    removeCart(){
      this.isShowCoupon()
      // this.use_coupon()
    },
    goBack () {
      // this.$router.push({ name: 'bestChoiceLookmore' })
      tapbeeCloseWebview()
    },
    hasUseCoupon () {
      let result1 = null
        // 商品是否可以使用購物金
        result1 =  this.cart.find(ele=>{
          return ele.use_coupon === 1 
        })
        // console.log("搜尋到可使用「購物金」",result1)
        this.use_coupon = (result1) ? true : false
    },
    hasUseTicket () {
      let result3 = null
        // 商品是否可以使用票券
       result3 =  this.cart.find(ele=>{
          return ele.activity_id !== 0 
        })
        // console.log("搜尋到可使用「票券」",result3)
        this.use_ticket = (result3) ? true : false
    },
    isShowCoupon () {
      // 
      this.reRenderCoupon()
      this.couponShow = false
      this.ticketShow = false
      this.hasUseCoupon();
      this.hasUseTicket();
      // console.log("this.use_coupon", this.use_coupon)
      // console.log("this.use_ticket", this.use_ticket)
      // console.log("this.user_has_ticket", this.user_has_ticket)
      // console.log("this.user_has_coupon", this.user_has_coupon)
       if((this.use_coupon && this.user_has_coupon)){
         this.couponShow = true
        //  console.log("顯示")
       }
       if((this.use_ticket && this.user_has_ticket)){
         this.ticketShow = true;
        //  console.log("顯示")
       }
    },
    reRenderCoupon () {
      this.reRenderCount ++;
    },
    nextStep () {      
      let items = []
      this.cart.forEach(function(v){
        items.push({
          'id': v.g_id,
          'name': v.g_name,
          'category': v.g_type,
          'variant': v.gDt.gDt_desc,
          'quantity': v.addCartNum,
          'price': v.g_originPrice
        })
      })
      trackBeginCheckout(items)
      this.$emit('setStep',1)
  }
  }
}
</script>
<style lang="scss" scoped>
.cart {
  &__footer {
    background: white;
    box-sizing: border-box;
    // display: flex;
    display: table;
    align-items: center;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #ccc;
    z-index: 99;
    height: 60px;
    width: 100vw;
    margin-left: -20px;
    // padding: 0 20px;
    padding: 20px 20px 0px 20px;
    font-size: 1.25em;
    .el-button {
      width: 30vw;      
    }
    .el-col-18 {
        margin-top: 20px;
    }    
  }
}
.empty {
  text-align: center;
  h1 {
    color: #646464;
  }
  button {
    position: absolute;
    top: 50vh;
    width: 50vw;
    left: 50%;
    transform: translateX(-50%);
  }
}
.shopName {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #ee4d2d;
}
</style>
