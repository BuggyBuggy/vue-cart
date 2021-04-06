<template lang="pug">
div(class="header" id="header" :style="detailOnly")
  div
    i(v-if='ispaySuccess')
    i.el-icon-arrow-left(@click='goBack' v-else)
  <span> {{title}} </span>
  div(v-if="isDetailGood" @click="switchArea")
    //-  img(src="@/assets/home.png")
  div(v-else @click="switchArea")
    span(v-show="cartShow")
      .count {{countInCart}}
      img(src="@/assets/cart.png")

</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      title: ''
    }
  },
  computed: {
    ...mapState('cart', ['cart']),
    countInCart () {
      return this.cart.length
    },
    ispaySuccess () {
      return this.$route.name === 'paySuccess'
    },
    isInCart () {
      return this.$route.path.indexOf('/cart/') !== -1
    },
    isDetailGood () {
      let self = this
      switch (this.$route.name) {
        case 'GoodDetail':
          self.title = '商品資訊'
          break
        case 'push_cart':
          self.title = '商品資訊'
          break
        case 'bestChoiceLookmore':
          self.title = '分類'
          break
        case 'paySuccess':
          self.title = '付款完成'
          break
        default:
          self.title = '購物車'
          break
      }
      return self.title
    },
    detailOnly () {
      // if(this.$route.name === 'detail'){
      //   return 'position: absolute'
      // }else{
      return 'position: fixed;'
      // }
    },
    cartShow () {
      console.log(this.$route.name)
      let isShow
      switch (this.$route.name) {
        case 'info':
        case 'detail':
        case 'payment':
          isShow = false
          break
        default:
          isShow = true
          break
      }
      return isShow
    }
  },
  create () {
    document.title = '購物車'
  },
  methods: {
    switchArea () {
      // const href = this.isInCart ? 'entry' : 'cart'
      // const href = this.isInCart ? 'bestChoiceLookmore' : 'cart'
      const href = this.isInCart ? '' : 'cart'
      this.$router.push({ name: href })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.count {
  position: absolute;
  top: 0;
  right: 7px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  line-height: 15px;
  background: red;
  color: #f1f2f1;
  text-align: center;
  border-radius: 50%;
}

.header {
  left: 0;
  right: 0;
  position: fixed;
  width: calc(100vw - 16px);
  z-index: 99;
  color: #356ea3;
  height: 40px;
  width: 100%;
  font-size: 20px;
  line-height: 40px;
  background: #f1f1f2;
  z-index: 10;
  top: 0;
  border-bottom: 1px solid #b4b4b4;
  padding: 0 14px 0 14px;
  box-sizing: border-box;
  display: flex;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    &:last-child {
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
  i {
    font-size: 30px;
  }
}
</style>
