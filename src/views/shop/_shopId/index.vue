<template lang="pug">
    el-main
      ListItem(v-for="item in goods" :item="item" :key="item.g_id")
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
      return this.getGoods(this.shopId)
    }
  },
  methods: {}
}
</script>
