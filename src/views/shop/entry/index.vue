<template lang="pug">
main
  .entry(v-for='shop in shops')
    router-link(:to='{ name: "list", params: { shopId: shop.id } }')
      .entry__link(:style='`backgroundImage:url(${shop.img})`')
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'entry',
  data () {
    return {
      removeMsg: []
    }
  },
  computed: {
    ...mapState('cart', ['cart']),
    ...mapState('goods', ['goods']),
    ...mapState(['shops'])
  },
  methods: {
    ...mapMutations('cart', ['removeFromCart', 'updateInfo']),
    ...mapActions('goods', ['fetchGoods']),
    checkAvailability () {
      return new Promise((resolve, reject) => {
        // deep clone & use the new ary to loop
        const copyCart = this.cart.slice(0)
        const lastIndex = copyCart.length - 1
        // if items in cart isn't still availableItem, remove them
        copyCart.forEach((cartItem, idx) => {
          const removeHandler = () => {
            this.removeFromCart(idx)
            let shopName
            for (let i = 0; i < this.shops.length; i++) {
              if (this.shops[i].id === cartItem.id) {
                shopName = this.shops[i].name
                break
              }
            }
            this.removeMsg.push(shopName + ' - ' + cartItem.g_name)
          }
          console.log('this.cart', this.cart)
          console.log('this.goods', this.goods)
          const isOnMarket = this.goods.some((originItem) => {
            const match = cartItem.g_id === originItem.g_id
            if (match) {
              const shortage = cartItem.g_nums > originItem.g_nums
              // shortage is unavailable
              if (shortage) {
                removeHandler()
              } else {
                // in cart but is still available, update info
                const info = { ...originItem, g_nums: cartItem.g_nums }
                this.updateInfo(info)
              }
              return true
            }
          })
          // notOnMarket is unavailable
          if (!isOnMarket) removeHandler()

          if (idx === lastIndex) resolve()
        })
      })
    },
    openRemoveMsg () {
      if (this.removeMsg.length < 1) return false
      let contentPartLi = ''
      this.removeMsg.forEach((msg) => {
        contentPartLi += `<li>${msg}</li>`
      })
      const content = `以下商品已從購物車移除：<ul>${contentPartLi}</ul>`
      this.$alert(content, '商品庫存更動', {
        confirmButtonText: '確認',
        dangerouslyUseHTMLString: true
      })
      this.removeMsg = []
    }
  },
  mounted () {
    this.$store
      .dispatch('fetchShops')
      .then(this.fetchGoods)
      .then(this.checkAvailability)
      .then(this.openRemoveMsg)
  }
}
</script>

<style lang="scss" scoped>
.entry {
  &__link {
    width: 100%;
    height: 40vw;
    box-sizing: border-box;
    border: 1px solid #eee;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
}
</style>
