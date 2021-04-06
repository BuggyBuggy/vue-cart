<template lang="pug">
    el-col(:xs="24" :sm="12" :md="8" :lg="6")
      el-card( :body-style="{ position:'relative' }")
        .image(:style="`background-image:url(${firstImage})`")
        .item
          h1.name {{item.name}}
          .price 單價：${{item.price}}
          .nums 數量：{{item.nums}}
          //- .controller
          //-   el-col(:span="11")
          //-     el-input-number(size='small' :min='1' :max='restNums' v-model='nums').controller__item
          //-   el-col(:span="1")
          //-   el-col(:span="10")
          //-     el-button(:type='btnType' :disabled='restNums < 1 || !nums' @click="addtoCartHandler").controller__item 購買

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
      return this.itemIsInCart(this.item.gdId)
    },
    forAddtoCart () {
      let item = JSON.parse(JSON.stringify(this.item))
      item.nums = this.nums
      return item
    },
    restNums () {
      console.log('shop_id', this.item.id)
      console.log('gdId', this.item)
      return this.getRestNums(this.item.id, this.item.type.gdId)
    },
    firstImage () {
      let img = this.item.img.split(',')[0]
      return img
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
        const nums = this.item.nums - this.restNums + this.nums
        const updateInfo = { id: this.item.gdId, nums }
        this.updateNums(updateInfo)
      }
      this.nums = 1
    },
    openNotify () {
      this.$notify({
        title: '成功加入購物車',
        message: this.item.name + '<br> 數量：' + this.nums,
        dangerouslyUseHTMLString: true,
        offset: 30,
        duration: 2000
      })
    }
  }
}
</script>
<style lang="scss" scoped src="./style.scss"></style>
