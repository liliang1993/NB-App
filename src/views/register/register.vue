<template>
  <div class='nb-register'>
    <x-header slot="header"
        style="width:100%;position:fixed;left:0;top:0;z-index:250;"
        class='vux-1px-b'
        :left-options="leftOptions"
        :right-options="rightOptions"
        title="注册账号"
        @on-click-back = 'onClickBack'
      >
    </x-header> 
    <transition 
    :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <div class="nb-register-box"  v-show='!isShowSecondPage'>
        <div class="nb-register-hd">
          温馨提示：您所填的必须为真实信息
        </div>
        <div class='nb-register-bd'>
          <group class='nbui-cell-group'>
          <x-input label-width='6em' type='tel' v-model='mobileNumber' title="手机号" placeholder='请输入手机号'>
          </x-input>
          </group>
          <group class='nbui-cell-group'>
            <x-input title="输入验证码" v-model='verifyCode' label-width='6em' :show-clear="false" placeholder='请输入验证码' class="weui-vcode">
            <!-- <div slot="right" class='nb-btn_mini' :class="[isSend?'nb-btn_disabled':'nb-btn_primary']" @click='sendVerCode'>{{verifyText}}</div> -->
            <x-button slot='right' type="primary" mini  :disabled=" isSend ? true : false" @click.native='sendVerCode'>{{verifyText}}</x-button>
            </x-input>
          </group>
          <div class="reg-agreement flex items-center">
              <i class='agreement-icon' :class="[isAgree?'reg-selected-icon':'reg-unSelected-icon']" @click='isAgree = !isAgree'>
              </i>
              <span>
                我已阅读并同意
                <router-link to='/account/customerAgreement' class='agree-link'>
                  《晋峰环球注册协议》
                </router-link>
              </span>
          </div>
          <x-button type="primary"  style="border:1px solid #48bed4;"  @click.native= "nextRegisterStep">下一步</x-button>
        </div>  
      </div>
    </transition>
    <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" >
      <div class="nb-register-box" v-if='isShowSecondPage'>
        <div class="nb-register-hd">
          温馨提示：您所填的必须为真实信息
        </div>
        <div class="nb-register-bd">
          <group class='nbui-cell-group'>
            <x-input label-width='5em' v-model='realName' title="姓名" placeholder='请输入真实姓名'>
            </x-input>
          </group>
          <!-- <group class='nbui-cell-group'>
            <x-input label-width='5em' type='number' v-model='idNo' title="身份证号码" placeholder='请输入真实身份证号码'>
            </x-input>
          </group> -->
          <group class='nbui-cell-group'>
            <x-input label-width='5em' type='password' v-model='password' title="密码" placeholder='请输入6-16位英文加数字密码'>
            </x-input>
          </group>
          <group class='nbui-cell-group'>
            <x-input label-width='5em' type='password' v-model='confirmPassword' title="确认密码" placeholder='请再次输入密码'>
            </x-input>
          </group>
          <group class='nbui-cell-group'>
            <x-input label-width='5em' v-model='agentId' title="会员编号" placeholder='若无可不填'>
            </x-input>
          </group>
           <x-button type="primary"  style="border:1px solid #48bed4; margin-top:20px;"  @click.native='registerApply'>注册并登录</x-button>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import {Group,XInput,
    XButton,
    XHeader} from 'vux'
import Api from 'api/api'
import {checkMobile,sendSms, checkPassword,checkCName,checkIdNum} from 'utils/utils'
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
      isNext:false,
      isSend:false,
      isAgree:true,
      isShowSecondPage: false,
      remainTime:60,
      mobileNumber:'',
      verifyCode:'',
      realName:'',
      // idNo:'',
      password:'',
      confirmPassword:'',
      agentId:''
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
     * 点击发送验证码按钮触发事件
    */
    sendVerCode(){
      if(!checkMobile(this.mobileNumber)){
        this.toast.show('手机格式不正确');
        return
      }
      sendSms(this.mobileNumber,0);
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
     * 点击下一步，效验页面内容
     * return 【true false】
    */
    checkFirstPageValid () {
      if(!checkMobile(this.mobileNumber)){
        this.toast.show('手机格式不正确');
        return false;
      }
      console.log('123',this.verifyCode);
      if(this.verifyCode == ''){
        this.toast.show('验证码不能为空');
        return false;
      }
      if(!this.isAgree){
        this.toast.show('请先同意本公司协议');
        return false;
      }
      return true;
    },

    /**
     * 点击下一步按钮触发验证码效验事件
    */
    nextRegisterStep () {
      if (this.checkFirstPageValid()){
        let params={
          VerifyCode: this.verifyCode ,
          Phone:this.mobileNumber,
          SmsType: 0
        }
        this.$vux.loading.show({
          text: 'Loading'
        })
        Api.CheckSmsVerifyCode(params).then(res=>{
          this.$vux.loading.hide();
          this.isShowSecondPage = true;
        }).catch(err=>{
          this.$vux.loading.hide();
        });
      }
    },

    /**
     * 第二步点击注册按钮效验页面数据
     *
    */
    checkSecondPageValid(){
      if(!checkCName(this.realName)){
        this.toast.show('姓名格式不合法');
        return false;
      }
      // if(!checkIdNum(this.idNo)){
      //   this.toast.show('身份证号码格式不合法');
      //   return false;
      // }
      if(!checkPassword(this.password)){
        this.toast.show('密码应为6-16位英文加数字');
        return false;
      }
      if(this.confirmPassword !== this.password){
        this.toast.show('两次密码输入不一致');
        return false
      }
      return true;
    },

    /**
     *点击注册并登陆按钮触发事件 
    */
    registerApply () {
      if(this.checkSecondPageValid()){
        var agentId = this.agentId ? this.agentId : 1000;
        this.$vux.loading.show({
          text: 'Loading'
        })
        Api.register({
          Phone:this.mobileNumber,
          RealName:this.realName,
          // IDNo:this.idNo,
          Password:this.password,
          AgentId: agentId,
          VerifyCode:this.verifyCode
        }).then(res=>{
          this.$vux.loading.hide();
          this.$store.commit('updateDefaultAccount', this.mobileNumber ); 
          commonApi.androidApi.showDialog({
            msg: "注册成功,请重新登录",
            leftButton: "重新登录",
            leftEvent: "changeRoute('/account/guide')"
          });
        }).catch(err=>{
          this.$vux.loading.hide();
        });
      }
    },
    /**
     * 
    */
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
  .nb-register {
    top: 0px;
  }
  .nb-register-box{
    position:absolute;
    top:0;
    padding-top:46PX;
    width:100%;
    height: 100%;

  }
  .nb-register-hd{
    padding-left:20px;
    background-color: #ddd;
    font-size:24px;
    height:66px;
    line-height:66px;
  }
  .nb-register-bd{
    padding:40px 30px 0;
  }
  .reg-agreement{
    font-size:24px;
    color:#666;
    margin:28px 0;
    .agree-link{
        color:#48bed4;
    }
  }
  .reg-selected-icon{
      background: url(../../assets/reg-selected.png) no-repeat center;
  }
   .reg-unSelected-icon{
      background: url(../../assets/reg-unSelected.png) no-repeat center;
  }
  .agreement-icon{
      display:inline-block;
      width: 30px;
      height: 30px;
      background-size: contain;
      margin-right:10px;
  }
</style>

