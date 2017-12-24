<template>
  <div>
     <x-header slot="header"
            class='view-header'
            :left-options="leftOptions"
            :right-options="rightOptions"
            title="找回密码"
            :transition="headerTransition"
           >
      <div class="nb-header-left" slot='overwrite-left' @click='$router.back(-1)'>
      <i  class='header-back-icon'>
      </i>
    </div>
    </x-header>
  <div class="nb-wrap">
    <group class='nbui-cell-group'>
      <x-input title="手机号码" type='tel' label-width='2.3rem' :show-clear="false" class="weui-vcode" v-model='mobileNumber'>
        <div slot="right" class='nb-btn_mini' :class="[isSend?'nb-btn_disabled':'nb-btn_primary']" @click='sendVerCode'>{{verifyText}}</div>
      </x-input>
    </group>
    <group class='nbui-cell-group'>
      <x-input label-width='2.3rem'  title="验证码" v-model='verifyCode'>
      </x-input>
    </group>
    <div class="nb-btn_submit nb-btn_primary" @click='nextResetPassword'>
        提交
    </div>
    </div>
  </div>
</template>


<script>
import {Group,XInput,XButton,XHeader} from 'vux'
import Api from '../Api/api'
import {checkMobile,sendSms} from '../utils/utils'
console.log('123',checkMobile);
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader
  },
  methods: {
    sendVerCode(){
        if(this.isSend ==true){
            return;
        }

        if(!checkMobile(this.mobileNumber)){
          this.toast('手机号码格式不正确');
          })
          return
        }
        sendSms(this.mobileNumber,3);
        this.isSend = true;
        this.remainTime = 60;
      var timer = setInterval(()=>{
            this.remainTime--;
            if(this.remainTime <0){
                clearInterval(timer);
                this.isSend =false;
            }
        },1000);
    },
    nextResetPassword(){
        if(!checkMobile(this.mobileNumber)){
          this.$vux.toast.show({
            type:'text',
           text: '手机号码格式不正确',
           position:'middle'
          })
          return
        }
        if(this.verifyCode==''){
            this.$vux.toast.show({
              type:'text',
             text: '验证码不能为空',
             position:'middle'
            })
            return
          }
        let params={
          VerifyCode: this.verifyCode ,
          Phone:this.mobileNumber,
          SmsType: 3
        }
        Api.CheckSmsVerifyCode(params).then(res=>{
          this.$router.push({
            path:'/account/forgotPwd2',
            query:{phone:this.mobileNumber,verifyCode:this.verifyCode}
          })
        }).catch(err=>{

        });

    }
  },
  computed: {
    verifyText(){
        if(this.isSend){
          return '倒计时'+this.remainTime+'S'
        }else{
            return '发送验证码'
        }
    },
    leftOptions () {
      return {
        // showBack: this.route.path !== '/'
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
    }
  },
  data () {
    return {
      verifyCode:'',
      isSend:false,
      remainTime:60,
      mobileNumber:''
    }
  }
}
</script>
<style lang='less'>
  .nb-wrap{
    padding:90px 20px 0;
  }

  .nb-btn_mini{
    width:186px;
    height:58px;
    text-align:center;
    font-size:24px;
    line-height: 58px;
    border-radius:3px;
    border:0
  }
  .nb-btn_primary{
    color:#fff;
    background-color:#48bed4;
  }
  .nb-btn_disabled{
    color:#fff;
    background-color:#ccc;
  }
  .nb-btn_submit{
    height:97px;
    text-align:center;
    font-size:40px;
    line-height: 97px;
    border-radius:3px;
    margin-top:52px;
  }
</style>

