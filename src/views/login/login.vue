<template>
  <div class='nb-login'>
    <div class="nb-login-bar">
      <img class="nb-login-logo" src="../../assets/logo.png">
    </div>
    <group class='login-group'>
        <x-input placeholder="请输入手机号码" type='number' v-model='account'>
              <i slot="label" class='login-icon__account'>
              </i>
        </x-input>
    </group>
    <group class='login-group'>
       <x-input placeholder="请输入密码" type='password' v-model='password'>
              <i slot="label" class='login-icon__pwd'>
              </i>
        </x-input>
    </group>
    <div class="login-group">
      <div class="radius-button bgc-btn" @click='login'>
          登录
      </div>
    </div>
    <div class="forgetPwd-bar">
        <router-link class='forgetPwd-text' to='/account/resetPassword'>忘记密码?</router-link>
    </div>
    <div class="login-group">
      <div class="radius-button no-bgc-btn" @click="$router.push({path:'/account/register'})">
            还没注册？
      </div>
    </div>   
  </div>
</template>

<script>
import { Group, XInput,XButton,XHeader } from 'vux'
import Api from 'api/api'
import commonApi from'api/androidApi'
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader
  },
  methods:{  
    login(){
      this.$vux.loading.show({
       text: 'Loading'
      })
      Api.login({Account:this.account,password:this.password}).then((res)=>{
          this.$vux.loading.hide();
          this.$store.dispatch('updateUserInfo',res.Data);
          this.$store.dispatch('updateToken',res.Auth);
          var obj = {};
          if(res.CustomerConfigInfos.length!==0){
            res.CustomerConfigInfos.map((item,index)=>{
              obj[item.ConfigKey] = item.ConfigValue
            });
          }
          this.$store.dispatch('updateConfigs',obj);
              console.log('123','success');
          this.$store.dispatch('updateDefaultAccount',this.account);     
          commonApi.androidApi.getTokenSuccess(this.$store.state.user.token.AuthToken,this.$store.state.user.userInfo.Mt4Account,this.$store.state.account.configs.customSymbolList,
this.$store.state.account.configs.quickOrder,this.$store.state.account.configs.quicklyClose,this.$store.state.account.configs.sendMessage,this.$store.state.account.configs.tradeNoise   
          );
      }).catch(err=>{
          this.$vux.loading.hide();
          commonApi.androidApi.getTokenFail(err);
          commonApi.androidApi.log('122',err);
      })
    }
  },
  mounted(){
  },
  data () {
    return {
      password:'',
      account:this.$store.state.defaultAccount
    }
  },
  computed:{
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
  }
}
</script>

<style lang='less'>
/*vux-header css*/

.nb-login{
  height:100%;
  
  background:url('../../assets/bg-login.png') no-repeat bottom;
  background-size:100% 150px;
}
.nb-login-bar{
  padding-top: 80px;
  text-align: center;
}
.nb-login-logo{
  width:180px;
  height:180px;
}
.forgetPwd-bar{
    line-height: 1;
    width:540px;
    margin:0 auto;
     font-size:32px;
     margin-top:20px;
     height:32px;
  .forgetPwd-text{
    color:#666;
    float:right;

  }
}

.login-icon__account{
  display:block;
  width:42px;
  height: 50px;
  background: url(../../assets/login-account.png) no-repeat center;
  background-size: contain;
  margin-right:20px;
}
.login-icon__pwd{
  display:block;
  width:42px;
  height: 50px;
  background: url(../../assets/login-pwd.png) no-repeat center;
  background-size: contain;
  margin-right:20px;
}

</style>
