<template lang="pug">
  div
    slot
    el-form(ref='form' :rules="rules" label-position="top" :model='form' label-width='80px' class="detail__form")
      el-form-item(label='工號' prop="id" required)
        el-input(v-model='form.id' disabled)
      el-form-item(label='訂購人姓名' prop="name")
        el-input(v-model='form.name' placeholder="王大明")
      el-form-item(label='訂購人電話' prop="tel")
        el-input(v-model='form.tel' type="tel" placeholder="0912345678")
      el-form-item(label='E-Mail' prop="mail")
        el-input(v-model='form.mail' type="email" placeholder="auolohas@gamil.com")
      el-form-item(label='配送地址' prop="address" )
        el-input(v-model='form.address' placeholder="台北市信義區信義路五段7號")
      el-form-item(label='付款方式' prop="pay" )
        <el-radio v-model="form.pay" label="1" id="creditCardPay">信用卡付費</el-radio>
        // <el-radio v-model="form.pay" label="2">TSPG</el-radio>
        // <el-radio v-model="form.pay" label="3">TSPay+</el-radio>
      el-form-item(label='發票方式' prop="invoic_type")
        <el-radio v-model="form.invoic_type" label="2" id="invoic2" @change="invoicChange2">二聯式電子發票</el-radio><br>
        <el-radio v-model="form.invoic_type" label="3" id="invoic3" @change="invoicChange3">三聯式電子發票</el-radio>
      div(v-if="form.invoic_type==3")
        el-form-item(label='' prop="invoic_name")
          el-input(v-model='form.invoic_name' placeholder="買受人" ref="input")
        el-form-item(label='' prop="invoic_tax_number" )
          el-input(v-model='form.invoic_tax_number' placeholder="統一編號")
      el-checkbox(v-model='form.terms')
        span(id="required") *
        el-button(type="text" @click="form.dialogVisible = true")  購物服務條款說明
      el-dialog(:visible.sync="form.dialogVisible" width="80%" center)
        div(id="explain")
          <span style="font-weight:bold;">[退貨說明]</span>
          <p>依照生活商城之規定，於商城內消費目前均享有商品到貨七天猶豫期之權益。申請退貨前，請您務必保持商品、附件、包裝、廠商紙箱及所有附隨文件或資料之完整性，將商品恢復原包裝，退回商品必須是全新狀態且包裝完整</p>
          <p>請您在訂單完成前，透過APP提出退貨退款申請，同時提供完整資料。</p>
          <p>生活商城將於接獲買家您申請退貨之次日起3個工作天內檢視您的退貨要求，受理後將委託商品廠商，在3-7個工作天內透過電話或E-mail方式與您連絡退貨相關事宜。</p>
          <p>提醒您，發生退貨退款問題時，商品怎麼退貨等相關事宜皆需由雙方自行協議。賣家可以基於正當理由對你的退貨要求提出爭議，賣家若遲遲未對訂單做處理，生活商城會為您溝通該事宜。</p>
          <span style="font-weight:bold;">[退款說明]</span>
          <p>若您目前已點選【申請退貨】，賣家會收到相關的系統提醒， 待賣家點選同意退貨退款後將會協助您進行退款。 使用信用卡消費，將會進行退刷處理， 您最晚可於21天後於發卡銀行查詢到未出帳明細的退款。</p>
          <p>（因各家銀行業務量不同，且遇例假日將順延，可能退款實際入帳日也會有所不同，請您留意。）</p>
          <p>而若賣家不同意退款 ，此筆訂單將會進入爭議， 將由相關單位的人員進行聯絡買賣雙方並暫時保管此款項。</p>
          <p>如有其他問題請聯絡客服Email：service@tapbee.cc</p>
      .terms_tip 請勾選購物服務條款說明
      .cart__footer
        //- el-col(:span="12")
        //-   el-button(type="success" style="float:left;" @click="goBack") 上一步
        el-col(:span="18" class="price") 金額：$ {{priceFormat}}
        el-col(:span="6")
          el-button(:type="btnStyleClass" style="float:right;" @click="submit(1)" :disabled='disabled') 下一步


      el-dialog(:visible.sync='dialog', width='85%')
        span(slot='title' id="dialogTitle")
          i.el-icon-info
          |  Info
        div.dialogBody 請再次確定
        br
        br        
        span.dialogBody 訂單金額：
          span.ntd NTD $ {{(total || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}}             
        span.dialog-footer(slot='footer')
          el-button(@click='dialog = false') 取消
          el-button(type='primary', @click='submitConfirmAmount') 確定        
    
      
</template>

<script>
import { mapGetters } from 'vuex'
// 驗證
const mailValidator = (rule, value, callback) => {
  // mail驗證方式 https://ithelp.ithome.com.tw/articles/10094951
  const emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  if (value.length === 0) {
    callback(new Error('請輸入信箱'))
  } else if (value.search(emailRule) === -1) {
    callback(new Error('請輸入正確信箱格式'))
  } else {
    callback()
  }
}
// 驗證
const phoneValidator = (rule, value, callback) => {
  // mail驗證方式 https://ithelp.ithome.com.tw/articles/10094951
  const phoneRule = /^[09]{2}[0-9]{8}$/
  if (value.length === 0) {
    callback(new Error('請輸入手機號碼'))
  } else if (value.search(phoneRule) === -1) {
    callback(new Error('請輸入正確手機格式'))
  } else {
    callback()
  }
}
export default {
  name: 'CartDetail',
  data () {
    return {
      form: {
        id: '',
        name: '',
        tel: '',
        mail: '',
        address: '',
        pay: '1',
        invoic_type: '2',
        invoic_name: null,
        invoic_tax_number: null,
        terms: false,
        dialogVisible: false
      },
      rules: {
        name: [{ required: true, message: '請输入姓名', trigger: 'blur' }],
        tel: [{ required: true, validator: phoneValidator, trigger: 'blur' }],
        mail: [{ required: true, validator: mailValidator, trigger: 'blur' }],
        address: [{ required: true, message: '請輸入地址', trigger: 'blur' }],
        pay: [{ required: true, message: '請選擇付款方式', trigger: 'blur' }],
        invoic_type: [{ required: true, message: '請選擇發票方式', trigger: 'blur' }],
        invoic_name: [{ required: true, message: '請输入買受人', trigger: 'blur' }],
        invoic_tax_number: [{ required: true, message: '請输入統一編號', trigger: 'blur' }],
        terms: [{ required: true, message: '請勾選購物説明', trigger: 'change' }]
      },
      dialog: false,
      disabled: true,
    }
  },
  methods: {
    goBack () {
      this.$emit('setStep', -1)
      this.$router.go(-1)
    },
    submit (isSubmit) {
      this.$refs['form'].validate(valid => {

        if(this.form.terms){
          document.querySelector('.terms_tip').style.display = 'none';
        }

        if ((!this.form.terms && !valid) || !this.form.terms) {
          document.querySelector('.terms_tip').style.display = 'block';
          this.disabled = true
          return false
        }
        if (!valid) {
          this.disabled = true
          return false
        }
        if (!this.form.terms) {
          document.querySelector('.terms_tip').style.display = 'block';
          this.disabled = true
          return false
        }
      
        if(this.form.terms && valid && this.form.terms){
          this.disabled = false
        }

        document.querySelector('#dialogTitle').parentNode.style.display = 'none'
        if(isSubmit === 1){
          this.dialog = true
        }        
        // this.$emit('keyInDetail', this.form)
        // this.$emit('setStep', 1)
        // this.$router.push({ name: 'payment' })
      })
    },
    submitConfirmAmount(){
      this.dialog = false
      this.$emit('keyInDetail', this.form)
      this.$emit('setStep', 1)
      this.$router.push({ name: 'payment' })
    },
    myTouchMove(evt){
        if(document.hasFocus){
          const inputIds = document.querySelectorAll('input[type=text]')  // 获取ID
          inputIds.forEach(function(v){
            v.blur()    // input失焦
          })
          document.activeElement.blur();   //  关闭键盘
        }
    },
    invoicChange2(){
      // this.disabled = (this.form.terms)?false:true
      this.form.terms = false
      this.disabled = true
      
    },
    invoicChange3(){
      // this.disabled = (this.form.invoic_name && this.form.invoic_tax_number)? false:true
      this.invoicChange2()
      this.$refs.input.focus()
    }
  },
  computed: {
    ...mapGetters('cart', ['total']),
    priceFormat: function(){
        // this.total = this.total-this.nowInputDiscount
        return ( this.total || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    btnStyleClass () {
      return this.disabled ? 'info' : 'primary'
    }
  },
  mounted () {
    window.addEventListener("touchmove",this.myTouchMove)  // 监听滑动事件
    window.addEventListener("input",this.submit)  // 监听oninput事件
    window.addEventListener("change",this.submit)  // 监听checkbox事件

    this.form.id = this.$store.state.employeeID
    
  }
}
</script>
 <style lang="scss" scoped >
.cart {
  &__footer {
    background: white;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #ccc;
    z-index: 99;
    height: 60px;
    width: 100vw;
    margin-left: -20px;
    padding: 0 20px;
    .el-button {
      width: 30vw;
    }
  }
}

#required{
  color:#f56c6c;
}

#explain{
  height: 60vh;
  white-space: normal;
  overflow: scroll;
}

.terms_tip{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    top: 100%;
    left: 0;  
    display: none;
}

.cart__steps{
  position: absolute;
}

.dialogBody{
  font-size: 18px;
}

.ntd{
  color: red;
}

.price{
  margin-top: 5px;
}

</style>
