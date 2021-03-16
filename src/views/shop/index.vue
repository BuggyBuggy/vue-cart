<template lang="pug">
  el-container
    Header
    router-view
</template>

<script>
import Header from './Header.vue'
export default {
  name: 'Shop',
  components: {
    Header
  }
}
</script>
