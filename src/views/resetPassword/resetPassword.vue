<template>
  <div class='nb-resetPassword'>
    <x-header slot="header"
        style="width:100%;position:fixed;left:0;top:0;z-index:250;"
        class='vux-1px-b'
        :left-options="leftOptions"
        :right-options="rightOptions"
        title="重置密码"
        @on-click-back = 'onClickBack'
      >
    </x-header>
    <div class='nb-resetPassword-wrapper'>
      <transition 
        :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
        <div class='nb-resetPassword-box' v-show='!isShowSecondPage'>
        <group class='nbui-cell-group'>
          <x-input title="手机号码" type='tel' label-width='5em' :show-clear="false" class="weui-vcode" v-model='mobileNumber'>
            <!-- <div slot="right" class='nb-btn_mini' :class="[isSend?'nb-btn_disabled':'nb-btn_primary']" @click='sendVerCode'>{{verifyText}}</div> -->
          </x-input>
        </group>
        <group class='nbui-cell-group'>
          <x-input label-width='5em'  title="验证码" v-model='verifyCode'>
            <x-button slot='right' type="primary" mini  :disabled=" isSend ? true : false" @click.native='sendVerCode'>{{verifyText}}</x-button>
          </x-input>
        </group>
        <!-- <div class="nb-btn_submit nb-btn_primary" @click='nextResetPassword'>
          下一步
        </div> -->
        <x-button type="primary"  style="border:1px solid #48bed4; margin-top:20px;"  @click.native= "nextResetPasswordStep">下一步</x-button>
      </div> 
      </transition>
      <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" >
      <div class='nb-resetPassword-box' v-if='isShowSecondPage'>
        <group class='nbui-cell-group'>
          <x-input label-width='5em'  v-model='password'  type='password' title="新密码" placeholder='请输入6-16位英文加数字密码'>
          </x-input>
        </group>
        <group class='nbui-cell-group'>
          <x-input label-width='5em' v-model='confirmPassword' type='password' title="确认密码">
          </x-input>
        </group>
        <x-button type="primary"  style="border:1px solid #48bed4; margin-top:20px;"  @click.native= "resetPasswordApply">保存</x-button>
      </div>  
      </transition> 
    </div>
   
   
  </div>
</template>


<script>
import {Group,XInput,XButton,XHeader} from 'vux'
import Api from 'api/api'
import {checkMobile, sendSms, checkPassword} from 'utils/utils'
import { mapState, mapActions } from 'vuex'
import commonApi from 'api/androidApi'
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader
  },
  data () {
    return {
      verifyCode:'',
      isSend:false,
      remainTime:60,
      mobileNumber:'',
      password: '',
      confirmPassword: '',
      isShowSecondPage: false
    }
  },
  methods: {
    onClickBack () {
      if( this.isShowSecondPage == true) {
        this.isShowSecondPage = false ;
      }else {
        // this.$router.go(-1);
        this.goBackRoute();
      }
    },
    /**
     *点击发送验证按钮触发事件
     */
    sendVerCode () {
      if(!checkMobile(this.mobileNumber)){
      console.log(this.toast);
      this.toast.show('手机格式不正确');
      return;
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

    /**
     *点击下一步按钮 效验验证码事件
    */
    nextResetPasswordStep () {
      if(!checkMobile(this.mobileNumber)){
        this.toast.show('手机格式不正确');
        return
      }
      if(this.verifyCode==''){
        this.toast.show(' 验证码不能为空');
        return
        }
      let params={
        VerifyCode: this.verifyCode ,
        Phone:this.mobileNumber,
        SmsType: 3
      }
      /**效验验证码*/
      this.$vux.loading.show({
          text: 'Loading'
        });
      Api.CheckSmsVerifyCode(params).then(res=>{
        this.$vux.loading.hide();
        this.isShowSecondPage = true;
      }).catch(err=>{
        this.$vux.loading.hide();
      });
    },

    /** 
     * 重置密码第二步的效验判断
    */
    checkSecondStepValid () {
      if(!checkPassword(this.password)){
        this.toast('密码应为6-16位英文加数字');
        return false;
      }
      if(this.confirmPassword !== this.password){
        this.toast('两次密码输入不一致');
        return false;
      }
      return true;
    },
  /** 
   * 第二步点击保存触发事件
  */
    resetPasswordApply () {
      if (this.checkSecondStepValid()) {
        this.$vux.loading.show({
          text: 'Loading'
        });
        Api.resetPassword({
          Phone: this.mobileNumber,
          NewPassword: this.password,
          VerifyCode: this.verifyCode
        }).then((res)=>{
          this.$vux.loading.hide();
          commonApi.androidApi.showDialog({
            msg: "重置密码成功,请重新登录",
            leftButton: "重新登录",
            leftEvent: "changeRoute('/account/guide')"
          });
        }).catch(err=>{
          this.$vux.loading.hide();
        })
      }
    }
  },
  computed:{
    leftOptions () {
      return {
        preventGoBack: true,
        backText: ''
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    verifyText(){
        if(this.isSend){
          return '倒计时'+this.remainTime+'S'
        }else{
            return '发送验证码'
        }
    },
    ...mapState({
      direction: state => state.global.direction
    }),
  }
}
</script>
<style lang='less'>
  .nb-resetPassword {
    top: 0;
  }
  .nb-resetPassword-wrapper{
    position:absolute;
    top:0;
    padding-top:46PX;
    width:100%;
    height: 100%;
  }
  .nb-resetPassword-box {
     padding:40px 30px 0;
  }

 
</style>

