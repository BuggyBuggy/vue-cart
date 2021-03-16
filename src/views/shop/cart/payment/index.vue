<template lang="pug">
    div
      slot
      form
          .form-group
            .form-group(:class='statusClass[status.number]')
              label.control-label(for='card-number')
                  span#cardtype
                  | {{cardType}}
              .form-control.card-number
            .form-group(:class='statusClass[status.expiry]')
              label.control-label(for='expiration-date') 卡片到期日
              .form-control.expiration-date#tappay-expiration-date
            .form-group(:class='statusClass[status.cvc]')
              label.control-label(for='cvc') 卡片後三碼
              .form-control.cvc
      .cart__footer
        //- .col-6.button
        //-   button.btn.btn-success(type="button" style="float:left;"  @click="goBack") 上一步          
        el-col(:span="18") 金額：$ {{priceFormat}}
        .col-6.button
          button.btn(type="button" style="float:right;" :class="btnStyleClass" :disabled='disabled' @click='submit') 支付

</template>

<style lang="scss" scoped src="./style.scss"></style>

<script src="./script.js"></script>
