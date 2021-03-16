<template>
    <div class="goodDetail">
        <!-- 幻燈片 -->
        <el-carousel indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="goodImg in goodImgs" :key="goodImg" id="goodImgCarousel">
                <!-- <div :style="'background-image:url(' + goodImg.g_img + ')'"></div> -->
                <img class="goodImg" :src="goodImg">
            </el-carousel-item>
        </el-carousel>
        <!-- 商品名稱、價錢、剩餘數量 -->
        <!-- 沒有優惠價 -->
        <el-row>
            <el-col :span="24"><div class="grid-content sideSpace"><h3  class="goodName" :data="goodName">{{ goodName }}</h3></div></el-col>
        </el-row>
        <div v-show="is_onsale == 0">
            <el-row>
                <el-col :span="12"><div class="grid-content sideSpace"><h3 :data="goodOriginPrice" style="color:red;">＄{{ originPriceFormat }}</h3></div></el-col>
            </el-row>
        </div>
        <!-- 有優惠價 -->
        <div v-show="is_onsale == 1">
            <div class="discount">
                <div id="discount_number" :data="discountResult">{{discountResult}}</div>
                <div>折</div>
            </div>
            <el-row>
                <el-col :span="12"><div class="grid-content sideSpace"><h3 :data="goodPrice" style="color:red;">優惠價：＄{{ priceFormat }}</h3></div></el-col>
                <el-col :span="12"><div class="grid-content sideSpace count_fix"><span class="countdown">{{ countdown }}</span></div></el-col>
            </el-row>
            <el-row>
                <el-col :span="12"><div class="grid-content sideSpace"><h4 :data="goodOriginPrice" class="originPrice">原價：＄{{ originPriceFormat }}</h4></div></el-col>
            </el-row>
        </div>
        <el-row style="margin:15px 0px 25px 120px;">
            <el-col :span="12" :offset="12"><div class="grid-content"><span class="remain" :data="goodRemain">剩餘數量：{{ goodRemain }}</span></div></el-col>
        </el-row>
        <hr>
        <!-- 商品描述 -->
        <el-row>
            <el-col :span="24"><div class="grid-content sideSpace"><h3>商品描述</h3></div></el-col>
        </el-row>
        <el-row>
            <el-col :span="24"><div class="grid-content sideSpace"><h4><pre :data="goodDesc">{{ goodDesc }}</pre></h4></div></el-col>
        </el-row>

        <!-- 加入購物車/立即購買  or 去購買 -->
        <div>
            <!-- 加入購物車/立即購買 -->
            <el-row v-show="is_internal == 0">
                <el-col :span="24">
                    <div class="grid-content">
                        <el-button-group>
                            <el-button class="buycartBtn" type="primary" @click="judgeAddCart">加入購物車</el-button>
                            <el-button class="buycartBtn" type="primary" @click="judgeBuyNow">立即購買</el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>
            <!-- 去購買 -->
            <el-row v-show="is_internal == 1">
                <el-col :span="24">
                    <div class="grid-content">
                        <el-button-group>
                            <el-button class="gobuyBtn" type="primary" @click="goWebsite">去購買</el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 加入購物車/立即購買 modal -->
        <el-dialog title="請點選商品規格" :visible.sync="addnow" width="90%" id="buynowDialog">
            <el-form :model="form">
                <!-- 規格 -->
                <el-form-item label="規格">
                    <br>

                    <div id="typeRadioBtn">
                        <el-radio-group v-model="gDt"  @change="onRadioChange">
                             <div style="margin-bottom: 20px"  v-for="goodDt in form.goodDts" :key="goodDt.gDt_id">
                                <el-radio-button :label="JSON.stringify({id: goodDt.gDt_id, num: goodDt.gDt_num, desc: goodDt.gDt_desc})" :key="goodDt.gDt_id" border>{{goodDt.gDt_desc}}</el-radio-button>
                            </div>

                        </el-radio-group>
                    </div>
                </el-form-item>

                <!-- 數量 -->
                <el-form-item label="數量" style="margin-top:70px;">
                    <br>
                    <el-input-number :value="1" v-model="form.addCartNum" @change="handleChange" :min="1" :max="gDt_Maxnum" label="數量"></el-input-number>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <!-- 加入購物車 -->
                <div v-if="AddCartOrBuyNow == 'AddCart'">
                    <el-button  class="dialogBtn" type="primary" @click="addtoCartHandler" :disabled="canBuy">加入購物車</el-button>
                </div>
                <!-- 立即購買 -->
                <div v-if="AddCartOrBuyNow == 'BuyNow'">
                    <router-link :to="{name:'detail'}">
                        <el-button  class="dialogBtn" type="primary" @click="addtoCartHandlerAndBuy" :disabled="canBuy">結帳</el-button>
                    </router-link>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import { goodDetail, goodGoWebsiteClickLog } from '@/api/index'
import { mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      nums: 1,
      // buynow: false,
      addnow: false,
      canBuy: true,
      AddCartOrBuyNow: '',
      form: {
        addCartNum: 0,
        // buyNowNum: 1,
        goodDts: []
      },
      goodId: '',
      goodImgs: [],
      goodName: '',
      goodType: '',
      goodPrice: '',
      goodOriginPrice: '',
      good_onsale_etime: '',
      goodRemain: '',
      goodDesc: '',
      is_internal: 2,
      is_onsale: 2,
      shop_id: '',
      gDt_id: '',
      gDt_desc: '',
      gDt_Maxnum: 1,
      gDt: '',
      use_coupon: '',
      now: new Date(),
      countdown: `loading...`,
      discountResult: ''
    }
  },
  created () {
    document.title = '商品資訊'
    const goodId = this.$route.params.goodId
    this.goodId = goodId
    // console.log(goodId)
    this.getGoodDetail(goodId)
    // console.log('this.is_internal', this.is_internal)
  },
  computed: {
    ...mapGetters('cart', ['itemIsInCart']),
    ...mapGetters('goods', ['getRestNums']),
    inCart () {
      return this.itemIsInCart(`${this.goodId}_${this.gDt_id}`)
    },
    restNums () {
      return this.getRestNums(this.shop_id, `${this.goodId}_${this.gDt_id}`)
    },
    forAddtoCart () {
    // let addCartNum = JSON.parse(JSON.stringify(this.form.addCartNum))
    // console.log('addCartNum', addCartNum)
    // // let buyNowNum = JSON.parse(JSON.stringify(this.buyNowNum))
    // item.g_nums = this.nums
    // console.log(this.form.addCartNum)
      let item = {
        g_id: `${this.goodId}_${this.gDt_id}`,
        g_name: this.goodName,
        g_price: this.goodPrice,
        g_originPrice: this.goodOriginPrice,
        g_type: this.goodType,
        g_onsale_etime: this.good_onsale_etime,
        g_nums: this.goodRemain,
        g_img: this.goodImgs[0],
        shop_id: this.shop_id,
        addCartNum: this.form.addCartNum,
        gDt: {
          gDt_id: this.gDt_id,
          gDt_desc: this.gDt_desc,
          gDt_Maxnum: this.gDt_Maxnum
        },
        use_coupon: this.use_coupon
      }
      // console.log('item', item)
      return item
    },
    priceFormat: function () {
      return (this.goodPrice || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    originPriceFormat: function () {
      return (this.goodOriginPrice || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
  },
  methods: {
    ...mapMutations('cart', ['addToCart', 'updateNums']),
    addtoCartHandler () {
      this.addnow = false
      this.openNotify()
      if (!this.inCart) {
        // console.log("DEGUB", this.forAddtoCart)
        this.addToCart(this.forAddtoCart)
      } else {
        // const nums = this.item.g_nums - this.restNums + this.nums
        if (this.form.addCartNum > this.gDt_Maxnum) {
          this.openErrorAdd()
        } else {
          const nums = this.restNums + this.form.addCartNum
          const updateInfo = { id: `${this.goodId}_${this.gDt_id}`, nums }
          // console.log('updateInfo', updateInfo)
          this.updateNums(updateInfo)
        }
      }
      // this.addToCart(this.forAddtoCart)
      this.nums = 1
      // ga
      // trackOutboundNoLink('購物車 商品詳細頁(加入購物車)', `${this.goodId}_${this.goodName}(${this.gDt_desc})`)
      let trackItem = this.forAddtoCart
      console.log('trackItem', trackItem)
      // trackAddToCart(trackItem.g_id, trackItem.g_name, this.goodType, trackItem.gDt.gDt_desc, trackItem.addCartNum, trackItem.g_originPrice)
    },
    openNotify () {
      this.$notify({
        title: '成功加入購物車',
        message: this.goodName + '(' + this.gDt_desc + ')<br> 數量：' + this.form.addCartNum,
        dangerouslyUseHTMLString: true,
        offset: 30,
        duration: 2000
      })
    },
    openErrorAdd () {
      this.$notify({
        title: '加入購物車失敗',
        message: '此商品數量已達上限',
        dangerouslyUseHTMLString: true,
        offset: 30,
        duration: 2000
      })
    },
    addtoCartHandlerAndBuy () {
      this.addtoCartHandler()
      this.$emit('setStep', 1)
    },
    handleChange (value) {
      // console.log(value);
    },
    getGoodDetail (goodId) {
      // goodDetail({ gid: goodId }).then(response => {
      //   // console.log('responseeee', response)
      //   // console.log('router', this.$route.query.isOverTime)
      //   let res = response.data.goodInfo
      //   // console.log('res', res)
      //   // this.goodPrice = (res.g_onsale_price && !this.$route.query.isOverTime)? res.g_onsale_price:res.g_price
      //   // 優惠價
      //   this.goodPrice = res.g_onsale_price
      //   // 原價
      //   this.goodOriginPrice = res.g_price
      //   // this.good_onsale_etime = res.g_onsale_etime
      //   this.good_onsale_etime = new Date(res.g_onsale_etime)
      //   // console.log('aaa', res.g_img)
      //   // console.log('res.g_nums', res.g_nums)
      //   // console.log('res gDt_num total: ', res.goodDetail.reduce((a, b) => a + (b['gDt_num'] || 0), 0))

      //   this.use_coupon = res.use_coupon

      //   this.goodImgs = res.g_img.split(',')
      //   this.goodName = res.g_name
      //   this.goodType = res.g_type
      //   // this.goodRemain = res.g_nums
      //   this.goodRemain = res.goodDetail.reduce((a, b) => a + (b['gDt_num'] || 0), 0)
      //   this.goodDesc = res.g_desc
      //   this.shop_id = res.shop_id
      //   this.form.goodDts = res.goodDetail
      //   this.is_internal = res.is_internal
      //   this.external_link = res.external_link

      //   // 0: 沒有優惠價，1:有優惠價
      //   this.is_onsale = (!res.g_onsale_price) ? 0 : 1

      //   let discount = (this.goodPrice / this.goodOriginPrice) * 10
      //   this.discountResult = (discount % 1 === 0) ? discount : discount.toFixed(1)

      //   // 如果打折數有小數點的話，marginLeft：-8px，剛好整數的話，marginLeft：-3px
      //   let discountNumber = document.querySelector('#discount_number')
      //   if (Math.floor(this.discountResult) === this.discountResult) {
      //     discountNumber.style.marginLeft = '-3px'
      //   } else {
      //     discountNumber.style.marginLeft = '-8px'
      //   }

      //   if (this.now > this.good_onsale_etime) {
      //     // console.log('商品優惠過期')
      //     this.is_onsale = 0
      //   } else {
      //     // console.log('商品還在優惠')
      //     // 倒數計時
      //     setInterval(() => {
      //       this.now = new Date()
      //       this.countdown = this.diffTime(this.now, this.good_onsale_etime)
      //     }, 1000)
      //   }
      // })
    },
    onRadioChange (item) {
      item = JSON.parse(item)
      this.form.addCartNum = 1
      this.gDt_id = item.id
      this.gDt_desc = item.desc
      this.gDt_Maxnum = item.num - this.restNums
      // console.log('gDt_Maxnum', this.gDt_Maxnum)
      // console.log('restNums', (this.form.addCartNum))
      if (this.form.addCartNum > this.gDt_Maxnum) {
        this.canBuy = true
      } else {
        this.canBuy = false
      }
    },
    judgeAddCart () {
      this.addnow = true
      this.canBuy = true
      this.gDt = ''
      this.AddCartOrBuyNow = 'AddCart'
    },
    judgeBuyNow () {
      this.addnow = true
      this.AddCartOrBuyNow = 'BuyNow'
    },
    goWebsite () {
      // console.log('gid', this.goodId)
      // console.log('talkie_id', this.$store.state.employeeID)
      // goodDetail({gid:this.goodId, user_id: this.$store.state.employeeID}).then(response =>{
      //     // console.log('goWebsite response:', response)
      //     if(response.data.status=='0'){
      //         // alert(response.data.goodInfo.external_link)
      //         // console.log(response.data.goodInfo.external_link)
      //         // window.open(this.external_link, '_blank', 'toolbar=yes')
      //         let url = response.data.goodInfo.external_link;
      //         // ga
      //         trackOutboundLink('購物車 商品詳細頁(去看看)', `${this.goodId}_${this.goodName}`, url)
      //     }
      // })
    },
    diffTime (startDate, endDate) {
      // endDate = new Date(endDate)
      let diff = endDate.getTime() - startDate.getTime()

      // 計算相差天數
      let days = Math.floor(diff / (24 * 3600 * 1000))

      // 計算出小時數
      let leave1 = diff % (24 * 3600 * 1000)
      let hours = Math.floor(leave1 / (3600 * 1000))
      // 計算相差分鐘數
      let leave2 = leave1 % (3600 * 1000)
      let minutes = Math.floor(leave2 / (60 * 1000))

      // 計算相差秒數
      let leave3 = leave2 % (60 * 1000)
      let seconds = Math.round(leave3 / 1000)

      let returnStr = seconds + '秒'
      if (minutes > 0) {
        returnStr = minutes + '分' + returnStr
      }
      if (hours > 0) {
        returnStr = hours + '小時' + returnStr
      }
      if (days > 0) {
        returnStr = days + '天' + returnStr
      }
      // console.log(returnStr)
      return returnStr
    }
  },
  mounted () {
    this.$store
      .dispatch('fetchShops')

    // this.diffTime(this.now, this.good_onsale_etime)

    // let _this = this;
    // this.countdown = setInterval(function(){
    //     _this.now = new Date();
    //     this.diffTime(_this.now, _this.good_onsale_etime)
    // }, 1000)
    // console.log('countdown', this.countdown)
  }
}
</script>

<style scoped>
.el-col{
  margin-top: -12px;
  margin-bottom: -12px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin-left: 50%;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
/* .goodDetail >>> .el-carousel__container{
    height: 30vh;
} */
.el-col h4{
  margin-right: 10px;
  padding-bottom: 48px;
  color: #475669;
}
.el-col h4 pre{
  font-size: 1.1em;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.el-button-group{
  min-width: 100%;
  margin-top: 24px;
  position:fixed;
  bottom:0;
}
.buycartBtn{
  background: #356ea3;
  width: 50%;
}
.gobuyBtn{
  background: #356ea3 !important;
  width: 100%;
}
.el-button--primary {
  border-color: white;
  height: 7vh;
}
#buynowDialog >>> .el-dialog__body{
  padding: 0px 30px 20px 30px;
}
#buynowDialog >>> .el-dialog__footer{
  padding: 0px;
}

/* #typeRadioBtn >>> .el-radio-button__inner{
    margin-right: 5px;
    margin-bottom: 5px;
} */

.sideSpace{
  margin-left: 10px;
}

.goodDetail{
  min-width: 100%;
}
.remain, hr{
  color:#b6b6b6;
}
.dialogBtn, .el-input-number{
  width: 100%;
  margin-top: 5px;
}
.goodImg{
  position: absolute;
  top: 60%;
  left: 50%;
  display: block;
  max-width: 100%;
  max-height: 90%;
  transform:translate(-50%,-50%);
}
#goodImgCarousel{
  background-color: white;
}
.count_fix{
  margin-top: 20px;
}
.countdown{
  position: absolute;
  right: 10px;
  background: #ffd700;
  color: #000;
  padding: 5px;
  font-size: 0.6em;
  border-radius: 10px;
}
.originPrice{
    margin-bottom: -60px;
    text-decoration: line-through;
}
.discount{
  position: absolute;
  right: 10px;
  margin-top: -35px;
  font-size: 0.7em;
  color: red;
  /* ribbon  */
  /* https://www.w3cplus.com/css/css-simple-shapes-cheat-sheet */
  width: 0px;
  height: 30px;
  border-left: 15px solid #ffd966;
  border-right: 15px solid #ffd966;
  border-bottom: 8px solid transparent;
}
#discount_number{
  /* margin-left: -7px; */
  margin-top: -1px;
}
.discount >>> div:nth-child(2){
  margin-left: -5px;
  margin-top: -1px;
}
.goodName{
  margin-right: 12vw;
}
</style>
