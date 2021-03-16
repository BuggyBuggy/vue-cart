<template>
  <div class="about">
    <el-row :gutter="8">
      <el-col :span="11" v-for="list in watchLogLists" :key="list.name" class="watchloglist">
        <router-link :to="{ name: 'GoodDetail', params: { goodId: list.g_id }}" @click.native="addGoodClickLog(list.g_id)">
            <el-card :body-style="{ padding: '0px' }">
            <img :src="list.g_img.split(',')[0]" class="image">
            <div style="padding: 10px;">
                <span class="desc">{{goodNameLimit(list.g_name)}}</span>
                <br>
                <div class="bottom clearfix">
                <span class="price">$ {{list.finalPrice}}</span>
                <br>
                <div type="text" class="button">已觀看： {{list.clickLog}} 次</div>
                </div>
            </div>
            </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { selUserWatchLog, goodClickLog } from '@/api/index'
export default {
  data () {
    return {
      watchLogLists: [],
      price: null
    }
  },
  created () {
    document.title = '已查看過'
    this.getSelUserWatchLog()
  },
  methods: {
    getSelUserWatchLog () {
      // selUserWatchLog({'employeeID':`${this.$store.state.employeeID}`}).then(response =>{
      //     // console.log(response.data.data)
      //     this.watchLogLists = response.data.data

      //     // console.log(this.watchLogLists)
      // })
    },
    addGoodClickLog (gid) {
      // goodClickLog({'gid': gid, 'uid':`${this.$store.state.employeeID}`}).then(res => {
      //     // console.log(res)
      // })
    },
    goodNameLimit (gName) {
      let len = gName.length
      if (len > 10) {
        var str = ''
        str = `${gName.substring(0, 10)}...`
        return str
      } else {
        return gName
      }
    }
  }
}
</script>

<style scoped>
.el-row{
  display:flex;
  flex-wrap:wrap;
  margin-left: 5px !important;
  margin-right: -30px !important;
  /* justify-content: center; */
}

.el-col{
  margin-top:20px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.price {
  padding: 0;
  float: left;
}
.button {
  font-size:8px;
  padding: 0;
  float: right;
}

.image {
  height: 27.5vh;
  width: 100%;
  display: block;
}

.desc{
  float: left;
  font-size: 1em;
}
.price{
    color: red;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>
