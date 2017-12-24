<template>
  <div style='height:100%;background-color:#fff;'>
    <!-- <x-header slot="header"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
      class='vux-1px-b'
      :left-options="leftOptions"
      :right-options="rightOptions"
      title="已绑定银行卡"
      @on-click-back = 'onClickBack'
    >
    </x-header>   -->
    <div class='wrapper'>
      <div class='bankCard-wrapper'>
        <ul class='bankCardBox-items' v-for='(item,index) in bankCardListComputed'>
          <li class="bankCardBox-item" :style="{backgroundImage:  'url('+item.bankBg+')'}" @click='selectItem(item)'>
              <div class='bankCardBox-item__con'>
                <p class='bankCardBox-item__title flex flex-column justify-between'>
                  <strong>{{item.bankName}}</strong>
                  <small>储蓄卡</small>
                </p>
                <p class='bankCardBox-item__number'>{{item.bankAccount | bankCardEncrypt}}</p>
              </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import {XHeader} from 'vux'
import  Api from '../Api/api';
import {BankDict} from '../configs/configs'

export default {
  name:'bankCardList',
  components: {
   XHeader
  },
  data
   () {
    return {
      bankCardList: [],
      BankList: BankDict
    }
  },
  methods: {
    onClickBack(){
      this.$emit('onClickBack');
    },
    selectItem(item){
      this.$emit('selectItem',item.bankAccount);
    }
  },
  filters:{
    bankCardEncrypt(item){
      return item.replace(/^(\d{4})\d+(\d{4})$/, "$1****$2")
    }
  },
  computed:{
    leftOptions () {
      return {
        // showBack: this.route.path !== '/'
        preventGoBack: true,
        backText: ''
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    bankCardListComputed () {
      let res =[];
      let obj;
      for(let item of this.bankCardList){
        for(let dict of this.BankList){
       
          if(item.BankName.indexOf(dict.name) >= 0){
            obj = {
              bankName: item.BankName,
              bankBg: require('../assets/bankCard/bankCard-'+dict.logo+'.png'),
              bankAccount: item.BankAccount
            };
            res.push(obj);
            break;
          }
        }  
      };
      console.log('ews',res);
      return res;
    }
    // headerTitle () {
    //   if(this.$store.state.route.path == '/account'){
    //     return '已绑定银行卡'
    //   }else {
    //     return '选择银行卡'
    //   }
    // }
  },
  mounted(){
    console.log('route',this.$store.state.route.path);
    Api.getBankCard().then(res=>{
        this.bankCardList.push(res.Data);
    })
  }
}
</script>
<style lang='less' scoped>
.wrapper{
  height:100%;
  width: 100%;
  background-color: #fff;
}
.bankCard-wrapper{
  position: relative;
}
.bankCardBox-items{
  padding:20px 10px;
}
.bankCardBox-item{
      height:200px;
      position: relative;
      border-radius:5px;
      background-position:center center;
      background-size:cover;
      background-repeat:no-repeat;
  }
.bankCardBox-item__con{
    color:#fff;
    position: absolute;
    left:140px;
    top:30px;
    .bankCardBox-item__title{
        font-weight:normal;
        font-size:28px;
        height: 70px;
        small{
          font-size:24px;
        }
    }
    .bankCardBox-item__number{
        margin-top:10px;
        font-size:48px;
        vertical-align: middle;
        span{
        display: inline-block;
        }
    }
}

</style>
