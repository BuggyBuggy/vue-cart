<template lang="pug">
    el-main
      ListItem(v-for="item in goods" :item="item" :key="item.gdId")
</template>

<script>
import { mapGetters } from 'vuex'
import ListItem from './ListItem'

export default {
  name: 'GoodsList',
  components: {
    ListItem
  },
  props: {
    shopId: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    ...mapGetters('goods', ['getGoods']),
    goods () {
      const goodList = this.getGoods(this.shopId)
      let newGoodList = []
      let type = []
      let lastId
      goodList.forEach(v => {
        type.push({
          detail_desc: v.detail_desc,
          detail_num: v.detail_num,
          gdId: v.gdId
        })
        if (lastId !== v.id) {
          newGoodList.push({
            shopId: v.shop_id,
            id: v.id,
            name: v.name,
            price: v.price,
            img: v.img,
            nums: v.nums,
            desc: v.desc,
            type: type
          })
        } else {
          type = []
        }
        lastId = v.id
      })
      return newGoodList
    }
  },
  methods: {}
}
</script>
