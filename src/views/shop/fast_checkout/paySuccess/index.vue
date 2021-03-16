<template>
    <div class="paySuccess">
        <img src="@/assets/checked.png">
        <div>付款完成</div>
        <div>訂單明細將寄送至您的Email</div>
        <el-row>
            <el-button type="primary" @click="closeWebview">OK</el-button>
        </el-row>
    </div>
</template>


<script>

export default {
  name: 'paySuccess',
  created(){
    document.title="付款完成"
  },  
  methods: {
    closeWebview () {
      tapbeeCloseWebview()
    }
  }
}
</script>


<style lang="scss" scoped>
    .paySuccess{
        text-align: center;
        margin-top: 20px;
        img{
            width: 30%;
        }
        div{
            margin-top: 15px;
            font-size: 1.5em;
            font-weight: 500;
        }
        .el-row{
            margin-top: 45px;
            background: #fff;
            padding: 2px;
            border-radius: 5px;
            display: inline-block;
            border: 1px solid gray;                      
            .el-button{
                font-size: 0.7em;
                padding: 15px 35px;
            }
        }
    }

</style>
