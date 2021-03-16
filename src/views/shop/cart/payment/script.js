import { mapState, mapGetters, mapMutations } from 'vuex'
import { Loading } from 'element-ui'
const tappaySetupOptions = {
  fields: {
    number: {
      element: '.form-control.card-number',
      placeholder: '**** **** **** ****'
    },
    expirationDate: {
      element: '#tappay-expiration-date',
      placeholder: 'MM / YY'
    },
    ccv: {
      element: '.form-control.cvc',
      placeholder: '後三碼'
    }
  },
  styles: {
    input: {
      'font-size': 'initial',
      color: 'gray'
    },
    ':focus': {
      color: 'black'
    },
    '.valid': {
      color: 'green'
    },
    '.invalid': {
      color: 'red'
    }
  }
}
export default {
  name: 'CartPayment',
  props: {
    details: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      items: [],
      disabled: true,
      cardType: '卡號',
      status: { number: 1, expiry: 1, cvc: 1 },
      statusClass: ['has-success', '', 'has-error'],
      loading: '',
      tappayIframeLoadedNums: 0
    }
  },
  computed: {
    btnStyleClass () {
      return this.disabled ? 'btn-secondary' : 'btn-primary'
    },
    ...mapState('cart', ['cart', 'nowSelectDiscountWay', 'nowInputDiscount']),
    ...mapGetters('cart', ['total']),
    priceFormat: function () {
      // this.total = this.total-this.nowInputDiscount
      return (this.total || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
  },
  methods: {
    tappay () {
      // 線上
      let serverType = 'production'
      let appKey = 'app_lVKcbm5BkAgfJjUDPQpPTT2v7FISvWWvaKdunCsXV5GtwhTGKGzqcKRLHeEY'
      // 測試
      // let serverType = 'sandbox'
      // let appKey = 'app_lVKcbm5BkAgfJjUDPQpPTT2v7FISvWWvaKdunCsXV5GtwhTGKGzqcKRLHeEY'
      TPDirect.setupSDK(
        13118,
        `${appKey}`,
        `${serverType}`
      )
      // set style
      TPDirect.card.setup(tappaySetupOptions)

      // listen for TapPay Field
      TPDirect.card.onUpdate(update => {
        this.disabled = !update.canGetPrime
        this.cardType = update.cardType === 'unknown' ? '卡號' : update.cardType
        this.status = { ...update.status }
      })
    },
    ...mapMutations('cart', ['resetCart']),
    openLodaing (text) {
      const loadingOption = { text }
      this.loading = Loading.service(loadingOption)
    },
    goBack () {
      this.$emit('setStep', -1)
      this.$router.go(-1)
    },
    submit () {
      this.forceBlurIos()
      this.openLodaing('送出訂單中')
      // validate again
      const canGetPrime = TPDirect.card.getTappayFieldsStatus().canGetPrime
      if (!canGetPrime) return false
      TPDirect.card.getPrime(this.sendOrder)
    },
    sendOrder (result) {
      // console.log('this.cart pay', this.cart)
      // console.log('this.details', this.details)
      // const createOrderParams = {
      //   prime: result.card.prime,
      //   details: this.details,
      //   amount: this.total,
      //   discount: {
      //     // way: 0->購物金  其他數字->活動購物金ID
      //     way: this.nowSelectDiscountWay,
      //     amount: this.nowInputDiscount
      //   },
      //   order: this.cart,
      //   payment_method: 'direct_pay'
      // }
      // console.log('createOrderParams', createOrderParams)
      let gaItem = []
      this.cart.forEach(function (v) {
        gaItem.push({
          'id': v.g_id,
          'name': v.g_name,
          'category': v.g_type,
          'variant': v.gDt.gDt_desc,
          'quantity': v.addCartNum,
          'price': v.g_originPrice
        })
      })
      this.items = gaItem
      // trackCheckoutProgress(this.items, this.nowInputDiscount)
      // createOrder(createOrderParams).then(this.responseHandler)
    },
    responseHandler (res) {
      this.loading.close()
      // code === 0 訂單成立
      // code === 1 庫存不足
      // code === 2 付款失敗
      // code === 3 db fail
      switch (res.data.code) {
        case 0:
        // res.data.order_id
          // trackPurchase(res.data.order_id, this.total, this.items)
          this.resetCart()
          this.openAlert('已經收到您的費用，商品即將寄出，有任何問題請聯絡：service@tapbee.cc', '付款成功')
          break
        case 1:
          this.openAlert('請重新選擇', '商品庫存不足')
          break
        case 2:
          this.openAlert('請重新操作', '付款失敗，請確認您的交易卡片資料')
          break
        default:
          this.openAlert('發生未知的錯誤，請稍後再試', '異常')
      }
    },
    openAlert (content, title) {
      this.$alert(content, title, {
        confirmButtonText: '確認',
        callback: action => {
          // console.log('title', title)
          if (title === '付款成功') {
            this.$router.push({ name: 'paySuccess' })
          } else {
            // this.$router.push({ name: 'entry' })
            // this.$router.push({ name: 'cart' })
          }
        }
      })
    },
    forceBlurIos () {
      const isIos =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      if (!isIos) {
        return
      }
      var input = document.createElement('input')
      input.setAttribute('type', 'text')
      // Insert to active element to ensure scroll lands somewhere relevant
      document.activeElement.prepend(input)
      input.focus()
      input.parentNode.removeChild(input)
    },
    iframeLoaded () {
      this.tappayIframeLoadedNums++
      const tappayIframeTotalNums = 3
      if (this.tappayIframeLoadedNums === tappayIframeTotalNums) {
        this.loading.close()
        const tappayIframes = document.querySelectorAll('iframe')
        tappayIframes.forEach(iframe => {
          iframe.removeEventListener('load', this.iframeLoaded)
        })
      }
    }
  },
  created () {
    this.openLodaing()
  },
  mounted () {
    this.tappay()
    const tappayIframes = document.querySelectorAll('iframe')
    tappayIframes.forEach(iframe => {
      iframe.addEventListener('load', this.iframeLoaded)
    })
  }
}
