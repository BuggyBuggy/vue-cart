<template lang="pug">
    el-col(:xs="24" :sm="12" :md="8" :lg="6")
      el-card( :body-style="{ position:'relative' }")
        .image(:style="'background-image:url(' + item.g_img + ')'")
        .item
          h1.name {{item.g_name}}
          .price 單價：${{item.g_price}}
          .nums 數量：{{item.g_nums}}
          .controller
            el-col(:span="11")
              el-input-number(size='small' :min='1' :max='restNums' v-model='nums').controller__item
            el-col(:span="1")
            el-col(:span="10")
              el-button(:type='btnType' :disabled='restNums < 1 || !nums' @click="addtoCartHandler").controller__item 購買

</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'GoodsItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      nums: 1
    }
  },
  computed: {
    ...mapGetters('cart', ['itemIsInCart']),
    ...mapGetters('goods', ['getRestNums']),
    inCart () {
      return this.itemIsInCart(this.item.g_id)
    },
    forAddtoCart () {
      let item = JSON.parse(JSON.stringify(this.item))
      item.g_nums = this.nums
      return item
    },
    restNums () {
      return this.getRestNums(this.item.shop_id, this.item.g_id)
    },
    btnType () {
      return this.restNums > 0 ? 'primary' : 'info'
    }
  },
  methods: {
    ...mapMutations('cart', ['addToCart', 'updateNums']),
    addtoCartHandler () {
      this.openNotify()
      if (!this.inCart) {
        this.addToCart(this.forAddtoCart)
      } else {
        const nums = this.item.g_nums - this.restNums + this.nums
        const updateInfo = { id: this.item.g_id, nums }
        this.updateNums(updateInfo)
      }
      this.nums = 1
    },
    openNotify () {
      this.$notify({
        title: '成功加入購物車',
        message: this.item.g_name + '<br> 數量：' + this.nums,
        dangerouslyUseHTMLString: true,
        offset: 30,
        duration: 2000
      })
    }
  }
}
</script>
<style lang="scss" scoped src="./style.scss"></style>
