<template lang="pug">
.order__container
  el-collapse(v-model='activeName', accordion)
    div(v-if="hasOrder")
      el-collapse-item(v-for='order in list' :key='order.id' :name='order.id')
        template(slot='title')
          el-row.order__item(type='flex' style='white-space: nowrap;')
            el-col 訂單編號：{{order.id}}
            el-col(style='text-align:right;')
              //- el-tag(:type='statusStyleFilter(order.status)') {{statusNameFilter(order.status)}}
              div(@click="openRefoundErroMsg($event, order.status, order.message)")
                el-tag(class="tag" :style="{backgroundColor:statusStyleFilter(order.status)}") {{statusNameFilter(order.status)}}
          el-row.order__item(type='flex')
            el-col(:span="12") {{order.list.length}}件商品
            el-col(style='text-align:right;') 金額：NTD $ {{(order.total || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}}
        .order__info
          .order__info__detail 訂購人姓名：{{order.name}}
          .order__info__detail  訂購人電話：{{order.tel}}
          .order__info__detail  訂購人信箱：{{order.mail}}
          .order__info__detail  訂購人地址：{{order.address}}
          .order__info__detail  訂單金額： NTD $ {{order.total_no_discount}}
          .order__info__detail(v-show="order.ticket_discount_price")  購物券折抵： NTD $ -{{order.ticket_discount_price}}
        el-table(:data='order.list')
          el-table-column(label='品名' prop='name')
          el-table-column(label='數量' prop='nums' width="55" align="center")
    div(v-else)
      div.noOrder
        span 目前尚無訂單

</template>

<script>
// import { getOrder } from '@/api'
export default {
  name: 'OrderList',
  data () {
    return {
      list: [],
      activeName: null,
      hasOrder: true
    }
  },
  created () {
    document.title = '訂單明細'
    this.fetchData()
  },
  methods: {
    fetchData () {
      // console.log('employeeID', this.$store.state.employeeID)
      // getOrder({'employeeID':this.$store.state.employeeID}).then(res => {
      //   this.list = res.data.order
      //   console.log(this.list )
      //   // console.log('res.data.order', res.data.order)
      //   this.hasOrder = (this.list.length === 0)? false: true
      // })
    },
    statusStyleFilter (status) {
      const statusMap = {
        // 2: 'success',
        // 1: 'primary',
        // 0: 'danger'
        0: '#ff9901',
        1: '#6aa84e',
        7: '#4a86e8',
        8: '#45818e',
        9: '#45818e',
        10: '#cc0000'
      }
      return statusMap[status]
    },
    statusNameFilter (status) {
      const statusMap = {
        // 2: '已完成',
        // 1: '運送中',
        // 0: '待出貨'
        0: '待出貨',
        1: '已出貨',
        7: '退貨審核中',
        8: '退貨失敗',
        9: '退貨成功(待退款)',
        10: '已退款'
      }
      return statusMap[status]
    },
    openRefoundErroMsg (e, status, message) {
      if (status !== 8) return
      e.stopPropagation()
      this.$alert(message, '退款失敗說明', {
        confirmButtonText: 'ok'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  &__container {
    width: 100vw;
    box-sizing: border-box;
    padding: 20px;
    margin: 40px 0;
  }
  &__item {
    padding: 14px 0;
  }
  &__info {
    border-top: 1px solid #ebeef5;
    &__detail {
      margin: 10px;
    }
  }
}
.el-collapse-item {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 20px;
  & /deep/ .el-collapse-item__header {
    flex-direction: column;
    height: auto;
    line-height: unset;
    align-items: unset;
    justify-content: unset;
    font-size: 16px;
    border: none;
    i {
      display: none;
    }
  }
}
.tag{
  color: white;
}
.noOrder{
  text-align: center;
  padding: 20px;
}
</style>
