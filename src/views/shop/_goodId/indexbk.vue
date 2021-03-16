<template>
    <div class="goodDetail">
        <!-- 幻燈片 -->
        <el-carousel indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="goodImg in goodImgs" :key="goodImg.g_img" id="goodImgCarousel">
                <!-- <div :style="'background-image:url(' + goodImg.g_img + ')'"></div> -->
                <img class="goodImg" :src="goodImg.g_img">
            </el-carousel-item>
        </el-carousel>    
        <!-- 商品名稱、價錢、剩餘數量 -->
        <el-row>
            <el-col :span="24"><div class="grid-content sideSpace"><h3 :data="goodName">{{ goodName }}</h3></div></el-col>
        </el-row>
        <el-row>
            <el-col :span="12"><div class="grid-content sideSpace"><h3 :data="goodPrice">NT{{ goodPrice }}</h3></div></el-col>
        </el-row>        
        <el-row type="flex" justify="end">
            <el-col :span="8"><div class="grid-content"><span class="remain" :data="goodRemain">剩餘數量：{{ goodRemain }}</span></div></el-col>
        </el-row>        
        <hr>
        <!-- 商品描述 -->
        <el-row>
            <el-col :span="24"><div class="grid-content sideSpace"><h3>商品描述</h3></div></el-col>            
        </el-row>        
        <el-row>
            <el-col :span="24"><div class="grid-content sideSpace"><h5><span :data="goodDesc">{{ goodDesc }}</span></h5></div></el-col>
        </el-row> 
        <!-- 加入購物車/立即購買 -->
        <el-row>
            <el-col :span="24">
                <div class="grid-content">
                    <el-button-group>
                        <el-button type="primary" @click="addnow = true">加入購物車</el-button>
                        <el-button type="primary" @click="buynow = true">立即購買</el-button>
                    </el-button-group>                    
                </div>
            </el-col>
        </el-row>      

        <!-- 加入購物車的modal -->
        <el-dialog title="請點選商品規格" :visible.sync="addnow" width="90%" id="buynowDialog">
            <el-form :model="form">
                <!-- 數量 -->
                <el-form-item label="數量">
                    <br>
                    <el-input-number v-model="form.addCartNum" @change="handleChange" :min="1" :max="gDt_Maxnum" label="數量"></el-input-number>
                </el-form-item>

                <!-- 規格 -->
                <el-form-item label="規格">
                    <br>
                    <div>
                        <el-radio-group v-model="gDt_id"  @change="onRadioChange">
                            <el-radio-button :label="{id:goodDt.gDt_id, num: goodDt.gDt_num}" :key="goodDt.gDt_id" v-for="goodDt in form.goodDts">{{goodDt.gDt_desc}}</el-radio-button>
                        </el-radio-group>
                    </div>            
                </el-form-item>
            </el-form>            
            <div slot="footer" class="dialog-footer">
                <el-button  class="dialogBtn" type="primary" @click="addtoCartHandler">加入購物車</el-button>
            </div>
        </el-dialog>  

        <!-- 立即購買的modal -->
        <el-dialog title="請點選商品規格" :visible.sync="buynow" width="90%" id="buynowDialog">
            <el-form :model="form">
                <!-- 數量 -->
                <el-form-item label="數量">
                    <br>
                    <el-input-number v-model="form.buyNowNum" @change="handleChange" :min="1" :max="gDt_Maxnum" label="數量"></el-input-number>
                </el-form-item>

                <!-- 規格 -->
                <el-form-item label="規格">
                    <br>
                    <div>
                        <el-radio-group v-model="gDt_id"  @change="onRadioChange">
                            <el-radio-button :label="{id:goodDt.gDt_id, num: goodDt.gDt_num}" :key="goodDt.gDt_id" v-for="goodDt in form.goodDts">{{goodDt.gDt_desc}}</el-radio-button>
                        </el-radio-group>
                    </div>                   
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  class="dialogBtn" type="primary" @click="buynow = false">結帳</el-button>
            </div>
        </el-dialog>        
    </div>
</template>

<script>
    import { goodDetail } from '@/api/index'
    import { mapMutations, mapGetters } from 'vuex'
    export default {
        data() {
            return {    
                nums: 1,     
                buynow: false,
                addnow: false,                
                form: {
                    addCartNum: 1,
                    buyNowNum: 1,
                    goodDts: [],                                                             
                },
                goodImgs: [],
                goodName: '',
                goodPrice: '',
                goodRemain: '',
                goodDesc: '',  
                gDt_id: '',    
                gDt_Maxnum: 1,                                   
            };
        },
        created(){
            const goodId = this.$route.params.goodId
            // console.log(goodId)
            this.getGoodDetail(goodId)
        },
        computed: {
            ...mapGetters('cart', ['itemIsInCart']),
            ...mapGetters('goods', ['getRestNums']),
            inCart () {
            return this.itemIsInCart(this.gDt_id)
            },
            forAddtoCart () {
            let addCartNum = JSON.parse(JSON.stringify(this.addCartNum))
            // // let buyNowNum = JSON.parse(JSON.stringify(this.buyNowNum))
            item.g_nums = this.nums
            return item
            }
        },        
        methods: {
            ...mapMutations('cart', ['addToCart', 'updateNums']),
            addtoCartHandler () {
                // console.log('aaaaaaaaaaa')
                this.addnow = false
                // this.openNotify()
                this.addToCart(this.forAddtoCart)
                // if (!this.inCart) {
                //     this.addToCart(this.forAddtoCart)
                // } else {
                //     const nums = this.item.g_nums - this.restNums + this.nums
                //     const updateInfo = { id: this.gDt_id, nums }
                //     this.updateNums(updateInfo)
                // }
                // this.nums = 1
                },
                openNotify () {
                this.$notify({
                    title: '成功加入購物車',
                    message: this.item.g_name + '<br> 數量：' + this.nums,
                    dangerouslyUseHTMLString: true,
                    offset: 30,
                    duration: 2000
                })
            },            
            handleChange(value) {
                // console.log(value);
            },
            getGoodDetail(goodId){
                goodDetail({gid:goodId}).then(response =>{                    
                    // console.log(response)
                    let res = response.data.goodInfo
                    this.goodImgs = res.g_img
                    this.goodName = res.g_name
                    this.goodPrice = res.g_price
                    this.goodRemain = res.g_nums
                    this.goodDesc = res.g_desc
                    this.form.goodDts = res.goodDetail
                })

            },
            onRadioChange(item) {    
                this.form.addCartNum = 1
                this.form.buyNowNum = 1                
                this.gDt_id = item.id
                this.gDt_Maxnum = item.num
            }
        }
    };
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
    .el-col h5{
        margin-right: 10px;
        padding-bottom: 48px;
        color: #475669;   
    }
    .el-button-group{
        min-width: 100%;
        margin-top: 24px;
        position:fixed; 
        bottom:0;                
    }
    .el-button{
        background: #356ea3;
        width: 50%;
    }
    #buynowDialog >>> .el-dialog__body{
        padding: 0px 30px 20px 30px;
    }
    #buynowDialog >>> .el-dialog__footer{
        padding: 0px;
    }    
    


    .sideSpace{
        margin-left: 10px;
    }

    .goodDetail{
        min-width: 100%;
    }
    .remain, hr{
        color:#b6b6b6;
    }
    .dialogBtn, .el-input-number, .goodImg{
        width: 100%;
    }
    #goodImgCarousel{
        background-color: white;
    }
</style>
