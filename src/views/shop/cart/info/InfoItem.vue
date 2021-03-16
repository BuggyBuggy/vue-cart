<template lang="pug">
    el-row.cart__item
        //- el-col(:span='6' v-for="img in item.g_img").cart__item__img
        el-col(:span='6').cart__item__img
            img(:src='item.g_img')
        el-col(:span='18')
            h3.cart__item__name.cart__item__info {{item.g_name}}
            <div class="cart__item__name cart__item__info" v-if="hasDetail">({{item.gDt.gDt_desc}})</div>
            .cart__item__nums.cart__item__info
              <el-input-number :value='item.addCartNum' v-model="num" @change="handleChange" :min="1" :max="item.gDt.gDt_Maxnum"></el-input-number>
            .cart__item__price.cart__item__info $ { {price || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'} }
            i.el-icon-delete.cart__item__delete(@click="removeItemFromCart(item.g_id)")
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'CartInfoItem',
  data () {
    return {
      hasDetail: true,
      num: 1,
      currentTime: '',
      price: '',
      origin_gId: '',
      spec_id: '',
      goodDetailMaxNums: ''
    }
  },
  props: ['item'],
  computed: {
    ...mapGetters('goods', ['getMaxNums']),
    ...mapState('cart', ['cart']),
    maxNums () {
      return this.goodDetailMaxNums
      // return this.item.gDt.gDt_Maxnum
      // return this.getMaxNums(this.item.shop_id, this.item.g_id)
    }
  },
  created () {
    // alert('b')
    this.origin_gId = this.item.g_id.split('_')[0]
    this.spec_id = this.item.gDt.gDt_id
    this.num = this.item.addCartNum
    this.getConfirmGoodDetail()
    // this.nowPrice()
    // console.log('this.item', this.item)
    // console.log('this.gDt_id', this.item.gDt.gDt_id)
  },
  methods: {
    ...mapMutations('cart', ['updateNums', 'removeFromCart']),
    handleChange (value) {
      // console.log(value)
      const updateInfo = { id: this.item.g_id, nums: value }
      // console.log('updateNums', this.updateNums(updateInfo))
      this.updateNums(updateInfo)
    },
    removeItemFromCart (gIdGdetailId) {
      this.removeFromCart(gIdGdetailId)
      this.$emit('removeCart')
    },
    getConfirmGoodDetail () {
      this.getNowFormatDate()
      // 確認商品詳細資訊是否無誤
      /*
      confirmGoodDetail({gid:this.origin_gId, g_detail_id: this.spec_id}).then(response =>{
        let res = response.data.data[0]
        // console.log('res', res)
        // console.log("更新資料", res.g_id)
        this.item.use_coupon = res.use_coupon
        this.item.activity_id = res.activity_id

        // 商品剩餘數量
        this.goodDetailMaxNums = res.good_detail_num

        // 商品是否有優惠
        if(res.good_onsale_etime){
          // console.log('有優惠')
          this.item.g_onsale_etime = res.good_onsale_etime
            // 商品優惠是否到期，到期的話，彈回原價
            if(moment(this.item.g_onsale_etime) <= moment(this.currentTime)) {
              // console.log('商品優惠過期')
              this.item.g_price = res.g_originPrice
              this.price = res.g_originPrice
              // setTimeout(() => {
              //   this.$notify({
              //       title: '商品優惠已結束',
              //       message: this.item.g_name + '('+ this.item.gDt.gDt_desc +')',
              //       dangerouslyUseHTMLString: true,
              //       offset: 30,
              //       duration: 3000
              //   })
              // }, 30)
            }else{
              // console.log('商品還在優惠')
              this.item.g_price = res.g_price
              this.price = res.g_price
            }
        }else{
          // console.log('沒有優惠')
          this.item.g_price = res.g_originPrice
          this.price = res.g_originPrice
        }
        this.item.nowOrderPrice = this.price

        // 商品是否已下架，下架的話，直接移除購物車
        if(res.g_status !== 0){
          // console.log(this.item.g_id)
          // console.log('已下架')
          this.removeFromCart(this.item.g_id)
          setTimeout(() => {
            this.$notify({
                title: '商品已不在架上',
                message: this.item.g_name + '('+ this.item.gDt.gDt_desc +')',
                dangerouslyUseHTMLString: true,
                offset: 30,
                duration: 3000
            })
          }, 30)
        }
        this.$emit('showCoupon')
      })
      */
    },
    getNowFormatDate () {
      var date = new Date()
      var sign1 = '-'
      var sign2 = ':'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      // var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      // var week = weekArr[date.getDay()]
      // 给一位数数据前面加 “0”
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 0 && day <= 9) {
        day = '0' + day
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds
      }
      // var currentdate = year + sign1 + month + sign1 + day + ' ' + hour + sign2 + minutes + sign2 + seconds + ' ' + week;
      var currentdate = year + sign1 + month + sign1 + day + ' ' + hour + sign2 + minutes + sign2 + seconds
      // console.log('currentdate', currentdate)
      this.currentTime = currentdate
    }
  }
}
</script>

<style lang="scss" scoped>
.cart {
  &__item {
    padding: 2vw;
    border: 1px solid #f1f2f1;
    position: relative;
    &__info {
      height: 6vh;
      line-height: 6vh;
      padding-left: 5vw;
    }
    &__name {
      white-space: nowrap;
      overflow: scroll;
      height: 6vh;
      line-height: 6vh;
      margin: 0;
    }
    &__img {
      height: 18vh;
      display: flex;
      align-items: center;
      img {
        width: 100%;
        max-height: 18vh;
      }
    }
    &__price {
      color: #ee4d2d;
    }
    &__delete {
      position: absolute;
      font-size: 5vw;
      right: 0;
      bottom: 0;
      width: 10vw;
      height: 10vw;
      line-height: 10vw;
      text-align: center;
    }
  }
}
</style>
