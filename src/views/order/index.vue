<template>
  <div id="orderLishHeader">
    <div id="nav">      
      <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" :route="{name:'orderList'}">我的訂單</el-menu-item>
        <!-- <el-menu-item index="2" :route="{name:'orderWatchLog'}">導購紀錄</el-menu-item> -->
      </el-menu>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss" scoped>
#orderLishHeader {
  overflow-x: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
.el-menu-item{
  // width:50%;
  width:100%;
  margin: 0 auto;
  text-align: center;
}
</style>

<script>
export default {
  data() {
      return {
        activeIndex: '1',
        activeLink: '',
        defaultSelect: '/list'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log('key', key);
        // console.log('keyPath', keyPath);
      },
      closeWebview () {
        tapbeeCloseWebview()
      }
    },
    watch:{
      $route (to,from){
        this.activeLink = to.path;
        this.activeIndex = (to.path == '/order/orderWatchLog')? '2': '1'
      }
    },
    mounted: function(){
      this.activeLink = this.$route.path;
      this.activeIndex = (this.$route.path == '/order/orderWatchLog')? '2': '1'
    }
}
</script>
