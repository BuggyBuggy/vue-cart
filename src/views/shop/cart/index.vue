<template lang="pug">
    div
      el-main.cart
          el-steps(:active='step', finish-status='success').cart__steps
            el-step(title='確認')
            el-step(title='表單')
            el-step(title='付款')
          router-view(@setStep='setStep', @keyInDetail='keyInDetail', :details='details')
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Cart',
  data () {
    return {
      step: 1,
      details: {},
    }
  },
  computed: {
    ...mapState('cart', ['cart']),  
  },
  methods: {
    setStep (step) {
      this.step += step
    },
    keyInDetail (details) {
      this.details = details
    }
  },
  mounted () {
    // console.log(this.$route.name)
    if(this.$route.name !== 'info' && this.$route.name !== 'push_cart' ){
      this.$router.replace({ name: 'info' })
    }
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
