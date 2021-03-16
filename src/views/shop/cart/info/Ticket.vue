
<template>
  <div class="coupon"  v-show="isShow">

    <div class="ticket_info" v-show="used_coupon ==true">
      <div class="left">
      <div class="ticketName">{{ sel_ticket.label}}</div>

      <div class="time">
      使用期限：{{ sel_ticket.validityPeriod }}
      </div>
      </div>
      <div class="right">折抵：
        <span class="discount_price">{{ sel_ticket.discount }} </span>
      </div>
    </div>
    <!-- 選擇coupon方式 -->
    <el-checkbox v-model="used_coupon" @change="CheckedChange(used_coupon)">使用購物券：</el-checkbox>
    <el-select v-model="coupon.sel" placeholder="購物金" :disabled="coupon.disabled" @change="SelecteChange" >
      <el-option
        v-for="item in coupon.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled">
      </el-option>
    </el-select>
    <br>
    <!-- 輸入金額 -->

   <!-- <span class="ticketName" v-show="activityTicket.show">活動購物金：{{ activityTicket.name }}</span>    -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import { userTotalCoupon, userActivityTicket } from '@/api/index'

export default {
  props: ['isShow', 'use_coupon', 'use_ticket', 'reRender'],
  data () {
    return {
      used_coupon: false,
      user_coupon: 1,
      originDiscountNum: 0,
      activityTicket: {
        name: '',
        show: true
      },
      coupon: {
        sel: 0,
        disabled: true,
        options: []
      },
      discount: {
        price: 0,
        disabled: true,
        readonly: false
      },
      sel_ticket: {}
    }
  },
  created () {
    this.CanUseCoupon()
    this.CheckedChange(false)
  },
  computed: {
    ...mapState('goods', ['useActivityTicket']),
    ...mapState('cart', ['cart'])
  },
  methods: {
    ...mapMutations('cart', ['setNowInputDiscount', 'setNowSelectDiscountWay']),
    CheckedChange: function (isCheck) {
      // isCheck = (this.user_coupon === 0)?false:isCheck
      // 判斷是否要disabled
      this.coupon.disabled = this.discount.disabled = !isCheck
      this.activityTicket.show = isCheck
      if (isCheck) {
        // console.log("total 被折扣", this.discount.price)
        this.setNowInputDiscount(this.discount.price)
      } else {
        // console.log("total 沒有折扣")
        this.setNowInputDiscount(0)
      }

      this.discount.readonly = this.coupon.sel !== 0
    },
    SelecteChange: function (value) {
      // value = 0(購物金)， value = ???(活動購物金id)
      if (value !== 0) {
        this.discount.disabled = true
      } else {
        this.discount.disabled = false
      }
      this.coupon.sel = value
      // console.log('this.coupon.sel', this.coupon.sel)])
      let options = this.coupon.options.filter(obj => obj.value === value)
      // console.log('okokokok',options[0])
      this.setNowSelectDiscountWay(value)
      this.discount.price = this.originDiscountNum = options[0].discount
      this.activityTicket.show = (value !== 0)

      this.sel_ticket = options[0]
      // console.log(this.sel_ticket)
      if (this.used_coupon) {
        this.setNowInputDiscount(this.discount.price)
      }
    },
    CanUseCoupon: function () {
      // 傳所有購物車裡的g_id給後端
      let gIds = []
      this.cart.forEach(function (v) {
        gIds.push(Number(v.g_id.split('_')[0]))
      })
      gIds = gIds.filter(function (element, index, arr) {
        return arr.indexOf(element) === index
      })

      console.log('gIds', gIds)
      // 若有『活動購物金』
      if (this.use_ticket) {
        // userActivityTicket({ user_id: this.$store.state.employeeID, g_id: gIds }).then(response => {
        //   let res = response.data.data
        //   if (res.length > 0) {
        //     this.$emit('return_user_has_ticket', true)
        //     res.forEach(e => {
        //       if (res.length > this.coupon.options.length) {
        //         this.coupon.options.push({
        //           value: e.ticket_id,
        //           label: e.ticket_name,
        //           discount: e.ticket_price,
        //           validityPeriod: e.validityPeriod
        //         })
        //       }
        //       this.activityTicket.name = e.ticket_name
        //       this.activityTicket.show = true
        //     })
        //     this.SelecteChange(res[0].ticket_id)
        //     // if(res.length > 0) this.CheckedChange(true)
        //   } else {
        //     this.$emit('return_user_has_ticket', false)
        //     this.activityTicket.show = false
        //   }
        //   // console.log('this.coupon.options', this.coupon.options)
        //   // console.log('this.coupon.options.length', this.coupon.options.length)
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupon{
    .el-checkbox {
      width: 35%;
    }
    .el-select {
      width: 60%;
      margin-left: 10px;
    }
    .left{
      width: 70%;
      display: inline-table;
      line-height: 1.5;
      margin-left: 10px;
      margin-bottom: 5px;
      margin-top: 5px;
    }
    .right{
      width: 30%;
      font-weight: 500;
      float: right;
      color: black;
      font-size: 16px;
      line-height: 3;
    }
    .ticketName{
      font-size: 16px;
      font-weight: 500;
      margin: 1px;
    }
    .ticket_info{
      border: 1px solid #ccc;
      margin: 10px;
      background-color: oldlace;
      margin: 0px;
      margin-bottom: 10px;
      color: dimgray;
      font-size: 16px;
    }
    .discount_price{
      color: red;
    }
    .time{
      color: darkgray;
      font-size: 14px;
      margin-top: 5px;
    }
  }
</style>
