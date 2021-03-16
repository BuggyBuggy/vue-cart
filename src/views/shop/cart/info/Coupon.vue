
<template>
  <div class="coupon"  v-show="isShow">        
    <!-- 選擇coupon方式 -->
    <el-checkbox v-model="used_coupon" @change="CheckedChange(used_coupon)">使用</el-checkbox>
    <el-select v-model="coupon.sel" placeholder="購物金" :disabled="coupon.disabled" @change="SelecteChange">
      <el-option
        v-for="item in coupon.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled">
      </el-option>
    </el-select>
    <!-- 輸入金額 -->
    <span class="discount">抵扣金額：</span>
    <el-input v-model="discount.price" placeholder="100" :disabled="discount.disabled" type="number" @input="CanOver100" :readonly="discount.readonly"></el-input>    
    <br>
    <span class="ticketName" v-show="activityTicket.show">活動購物金：{{ activityTicket.name }}</span>    
  </div>
</template>


<script>
import { mapState, mapMutations } from 'vuex'
import { userTotalCoupon, userActivityTicket } from '@/api/index'

export default {
  props: ['isShow', 'use_coupon', 'use_ticket', 'reRender'],
  data() {
    return {      
      counter: false,
      used_coupon: true,
      user_coupon: 1,
      originDiscountNum: 0,
      activityTicket:{
        name: '',
        show: true
      },
      coupon:{
        sel: 0,
        disabled: true,
        options: []         
      },            
      discount: {
        price:0,
        disabled: true,
        readonly: false
      }
    }
  },
  created(){
    this.CanUseCoupon()
    this.CheckedChange(true)    
  },
  computed: {
    ...mapState('goods', ['useActivityTicket']),
    ...mapState('cart', ['cart']),
  },
  methods:{
    ...mapMutations('cart', ['setNowInputDiscount', 'setNowSelectDiscountWay']),
    CheckedChange:function(isCheck){
      // isCheck = (this.user_coupon === 0)?false:isCheck
      // 判斷是否要disabled
      this.coupon.disabled = this.discount.disabled = !isCheck  
      this.activityTicket.show = isCheck
      if(this.counter){
        document.querySelector('.discount').style.color = (isCheck)?'#007bff':'#606266'
      }
      this.counter = true
      if(isCheck){
        this.setNowInputDiscount(this.discount.price)        
      }else{
        this.setNowInputDiscount(0)
      }

      this.discount.readonly = this.coupon.sel !== 0
    },
    SelecteChange:function(value){
      // value = 0(購物金)， value = ???(活動購物金id)
      if(value !== 0){
        this.discount.disabled = true;
      }else{
        this.discount.disabled = false;
      }
      this.coupon.sel = value
      // console.log('this.coupon.sel', this.coupon.sel)])
      let options = this.coupon.options.filter(obj=>obj.value===value)
      // console.log('okokokok',options[0])
      this.setNowSelectDiscountWay(value)
      this.discount.price = this.originDiscountNum = options[0].discount
      this.setNowInputDiscount(this.discount.price)
      this.activityTicket.show  = (value !== 0) ? true:false
    },
    CanUseCoupon:function(){
      // 若有『購物金』
      if(this.use_coupon){
        userTotalCoupon({user_id:this.$store.state.employeeID}).then(response =>{  
          // console.log('response', response)      
          let user_coupon = this.user_coupon = response.data.data[0].total_coupon
          let user_canUse_coupon
            if(user_coupon  !== 0){
              user_canUse_coupon = (user_coupon>=100)?100:user_coupon
              this.$emit('return_user_has_coupon', true)
              this.coupon.options.push({
                value: 0,
                label: '購物金',
                discount: user_canUse_coupon
              })   
              this.SelecteChange(this.coupon.sel)
            }else{
              user_canUse_coupon  = 0
              this.$emit('return_user_has_coupon', false)
            }

            // console.log("使用者擁有購物金", user_canUse_coupon)
              
          
          // if(user_coupon !== 0){
          //   let user_canUse_coupon = (user_coupon>=100)?100:user_coupon
          //   this.coupon.options.push({
          //     value: 0,
          //     label: '購物金',
          //     discount: user_canUse_coupon
          //   })    
          // }               
          this.discount.readonly = user_coupon === 0  
          // console.log('this.coupon.options', this.coupon.options)
          // console.log('this.coupon.options.length', this.coupon.options.length)
          // if(this.coupon.options.length === 0) {
          //   this.setUseActivityTicketFalse('yes')  
          // }                  
        })                
      }
      
      // 傳所有購物車裡的g_id給後端
      let g_ids = []
      this.cart.forEach(function(v){
        g_ids.push(Number(v.g_id.split('_')[0]))
      })
      g_ids = g_ids.filter(function(element, index, arr){
          return arr.indexOf(element) === index;
      })
      // 若有『活動購物金』
      if(this.use_ticket){
        userActivityTicket({user_id:this.$store.state.employeeID, g_id:g_ids}).then(response =>{
          let res = response.data.data
          // console.log('res', res)
          if(res.length > 0){
            this.$emit('return_user_has_ticket', true)
            res.forEach(e => {
              this.coupon.options.push({
                value: e.ticket_id,
                // label: e.ticket_name,
                label: '活動購物金',
                discount: e.ticket_price
              })           
              this.activityTicket.name = e.ticket_name
              this.activityTicket.show = true
            });
            this.SelecteChange(res[0].ticket_id)               
            // if(res.length > 0) this.CheckedChange(true)               
          }else{
            this.$emit('return_user_has_ticket', false)
            this.activityTicket.show = false
          }
          // console.log('this.coupon.options', this.coupon.options)
          // console.log('this.coupon.options.length', this.coupon.options.length)       
        })        
      }
    },
    CanOver100:function(){
      // 若user選擇『購物金』，則不可超過100
      let value = this.discount.price      
      // 最少折抵1元，最多折抵100元
      if(value<1 || value>100){
        this.$alert('購物金最少折抵1元，最多折抵100元', `您的購物金餘額為: ${this.user_coupon}`, {
          confirmButtonText: '確定',
          callback: action => {
            this.discount.price = this.originDiscountNum   
            this.setNowInputDiscount(this.discount.price)         
          }
        })
      }    
      this.setNowInputDiscount(this.discount.price)        
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupon{
    .el-select {
      width: 30%;
      margin-left: 10px;
    }
    .el-input{
      width: 27%;
    }
    .discount{
      color: #007bff;
      font-size: 14px;
      font-weight: 500;
      margin-left: 10px;
    }
    .ticketName{
      font-size: 14px;
    }
  }
</style>
