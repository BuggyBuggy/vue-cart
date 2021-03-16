<template lang="pug">
    el-row.cart__item
        el-col(:span='6').cart__item__img
            img(:src='item.g_img')
        el-col(:span='18')
            h3.cart__item__name.cart__item__info {{item.g_name}}
            .cart__item__nums.cart__item__info
              el-input-number(:value='item.g_nums' size="mini" :min='1' :max='maxNums' @change="handleChange")
            .cart__item__price.cart__item__info $ {{item.g_price}}
            i.el-icon-delete.cart__item__delete(@click="removeFromCart(item.g_id)")
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'CartInfoItem',
  props: ['item'],
  computed: {
    ...mapGetters('goods', ['getMaxNums']),
    ...mapState('cart', ['cart']),
    maxNums () {
      return this.getMaxNums(this.item.shop_id, this.item.g_id)
    }
  },
  created(){
    // console.log('this.item', this.item)
  },
  methods: {
    ...mapMutations('cart', ['updateNums', 'removeFromCart']),
    handleChange (value) {
      const updateInfo = { id: this.item.g_id, nums: value }
      this.updateNums(updateInfo)
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
