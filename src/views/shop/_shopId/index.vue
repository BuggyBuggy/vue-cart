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
      console.log(this.getGoods(this.shopId))
      return this.getGoods(this.shopId)
    }
  },
  methods: {}
}
</script>
