<template>
<div>
  <div class='nb-my-top'>
      <p class="nb-my-name">
        {{userInfo.RealName}}
      </p>
      <p class="nb-my-tradeNum">
        交易账号:{{userInfo.Mt4Account}}
      </p>
  </div>
  <div class="my-grids">
      <div class='my-grid' @click="bindBankCardRoute()">
          <div class='my-grid-icon'>
            <img :src="bankCardImg" alt="">
          </div>
          <p class='my-grid-text' :style="{color: userInfo.BankAccount == ''? '#000':'#48bed4' }">{{userInfo.BankAccount!==''?'银行卡已绑定': '银行卡绑定'}}</p>
      </div>
      <div class='my-grid' @click="$router.push({path:'/account/personalInfo'})">
          <div class='my-grid-icon'>
            <img :src="idCardImg" height="63" width="86" alt="">
          </div>
          <p class='my-grid-text' :style="{color: userInfo.IsUploadIdCard ? '#48bed4' :'#000' }">{{userInfo.IsUploadIdCard? '已实名认证' : '实名认证'}}</p>
      </div>
      <div class='my-grid' @click="$router.push({path:'/account/personalInfo'})">
          <div class='my-grid-icon tel-icon'>
            <img src="../../assets/bind-tel.png" alt="">
          </div>
          <p class='my-grid-text' style="color : #48bed4 ">手机号码</p>
      </div>
  </div>
    <group class='nbui-cell-group' >
      <cell title="修改密码"  is-link link='/account/changePassword'>
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-changePassword'>
          </i>
        </div> 
      </cell>
      <cell title="交易设置"  is-link link='/account/tradeSetting'>
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-tradeSetting'>
          </i>
        </div> 
      </cell>
      <cell title="关于我们"  is-link link='/account/aboutUs'>
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-aboutUs'>
          </i>
        </div> 
      </cell>
      <!-- <cell title="清除缓存" value="105M" is-link></cell> -->
  </group>
    <div class="nb-my-exit">
      <div class="my-exit-btn" @click='logoutClick'>
          退出
      </div>
    </div>
</div>
</template>

<script>
import {Group,Grid, GridItem, Cell,XHeader} from 'vux'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import store from 'storejs'
import { mapState, mapActions } from 'vuex'
import bankCardList from 'components/bankCardList'
export default {
  components: {
    Group,Grid, GridItem,Cell,XHeader,bankCardList
  },
  data () {
    return {
      bankCardListShow:false
    }
  },
  methods:{
    //点击绑定银行卡的路由选择
    bindBankCardRoute(){
      if(this.userInfo.BankAccount == ''){
        this.$router.push({path:'/account/bindBank'});
      }else{
        this.$router.push({path:'/account/bankCardList'});
      }
    },
    //点击退出按钮触发事件
    logoutClick () {
      this.logout();
      commonApi.androidApi.showDialog({
        msg: "确认退出当前账号吗",
        leftButton: "取消",
        leftEvent: "",
        rightButton: '确认',
        rightEvent: 'logout()'
      });
    },
    //选择确认退出选项触发事件
    logout(){
      window.logout= ()=>{
        this.$vux.loading.show({
          text: 'Loading'
        })  
        Api.logout().then(res=>{
          this.$vux.loading.hide();
            this.$store.dispatch('clearUserInfo');
            this.$store.dispatch('clearConfigs');
            this.$store.dispatch('updateToken',{});
            // this.$store.dispatch('resetState');
            store.clear();
            store.set('defaultAccount',this.$store.state.defaultAccount);
            // this.$router.push({
            //   path:'/account/guide'
            // })
            commonApi.androidApi.logout();
        }).catch(err=>{
          this.$vux.loading.hide();
        })
      }
    },
    authClick(){
      if(!this.userInfo.IsUploadIdCard){
        this.$router.push({path:'/account/certification'});
      }else{
        this.toast.show('如需更换身份证请联系客服');
      }
      // this.$router.push({path:'/account/certification'});
    }
  },
  computed:{
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    bankCardImg(){
        if( this.userInfo.BankAccount == ''){
           return require('../../assets/my-bank-card.png');
        }else{
          return require('../../assets/bind-bankCard.png');
        }
    },
    idCardImg(){
      if( this.userInfo.IsUploadIdCard){
          return require('../../assets/bind-idCard.png');
        }else{
          return require('../../assets/my-id-card.png');
        }
    }
  }
}
</script>

<style lang='less' scoped>
.mainPage{
  position:absolute;
  height:100%;
  width: 100%;
}
.bankCardList{
   position:absolute;
   left:0;
    z-index:999;

}
/*顶部banner*/
.nb-my-top{
  /*height:158px;*/
  padding:33px 0;
  background-color: #48bed4;
  .nb-my-name{
      color:#fff;
      text-align: center;
      font-size:40px;
      margin-bottom:25px;
  }
  .nb-my-tradeNum{
      color:#fff;
      opacity:0.8;
      text-align: center;
      font-size:32px;
  }
}
/*第二栏*/
.my-grids{
        padding:20px 0;
        overflow: hidden;
}
.my-grid{
    position: relative;
    float:left;
    width:33.33333333333%;
    padding:16px 0;
     text-align: center;
     &:before {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 1px solid #ccc;
    color: #D9D9D9;
    transform-origin: 100% 0;
    transform: scaleX(0.5);
  }
}
.my-grid-icon{
    width:58px;
    height:45px;
    margin:0 auto 26px;
    &.tel-icon{
      width:50px;
      height:45px;
    }
    img{
        display:block;
        width:100%;
        height:100%;
    }
}
.my-grid-text{
  font-size: 30px;
  color:#333;
}
.c-4abcd2{
    color:  #4abcd2
}
.btn-grid{
    margin-top:54px;
    padding:0 20px;
}
.nb-cap-btn{
    border:1px solid #48bed4;
    font-size:34px;
    width:327px;
    height:87px;
    line-height:87px;
    text-align:center;

    &.btn-l{
        float:left;
        color:#48bed4;
    }
    &.btn-r{
      float:right;
      background-color: #48bed4 ;
        color:#fff;
    }
}
/*退出按钮*/
.nb-my-exit{
  margin-top:100px;
  padding:0 20px;
  .my-exit-btn{
      height:92px;
      border:1PX solid #48bed4;
      color:#48bed4;
      font-size:34px;
      line-height:92px;
      text-align:center;
  }
}

.cell-icon-changePassword{
  background-image:url(../../assets/icon-changePassword.png);
}
.cell-icon-tradeSetting{
  background-image:url(../../assets/icon-tradeSetting.png);
}
.cell-icon-aboutUs{
  background-image:url(../../assets/icon-aboutUs.png);
}
</style>
