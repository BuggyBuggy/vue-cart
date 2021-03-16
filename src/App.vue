<template lang="pug">
  div
    router-view(v-wechat-title='$route.meta.title')
</template>

<script>
export default {
  name: 'app',
  beforeCreate () {
    // const id = userCheck().data.cookieUid
    const id = 'lily.chen'
    if (id) {
      this.$store.commit('setEmployeeID', id)
    }
  }
}
</script>
<style lang="scss" src="./assets/all.scss"></style>
