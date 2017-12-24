<template>
  <div>
    <div class="nb-changePassword">
      <group class='nbui-cell-group'>
        <x-input class='readonly-cell' label-width='2.3rem' title="账户" :value='$store.state.user.userInfo.Mt4Account' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.3rem' title="旧密码" type='password' v-model = 'oldPassword'>
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.3rem' title="新密码" type='password' placeholder='请输入6-16位英文加数字密码' v-model = 'newPassword'>
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.3rem' title="确认密码" type='password' v-model = 'confirmPassword'>
        </x-input>
      </group>
      <!-- <div class="nb-btn_submit nb-btn_primary" @click='changePassword'>
              保存
      </div> -->
      <x-button type="primary"  style="border:1px solid #48bed4; margin-top:20px;" @click.native='changePassword'>保存</x-button>
      <div class="nb-form-desc">
        忘记密码？前往<router-link to='/account/resetPassword' style='color:#d40404;'>找回密码</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import {Group,XInput,XHeader,XButton,Alert} from 'vux'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import {checkPassword} from 'utils/utils'
import store from 'storejs'
export default {
  components: {
    Group,
    XInput,
    XHeader,
    XButton,
    Alert
  },
  methods: {
    changePassword(){
      if(this.oldPassword ===''){
        this.$vux.toast.show({
           type:'text',
           text: '请填写旧密码',
           position:'middle'
          })
        return
      }
      if(!checkPassword(this.newPassword)){
        this.$vux.toast.show({
           type:'text',
           text: '新密码应为6-16位英文加数字',
           position:'middle'
          })
        return
      }
      if(this.confirmPassword !== this.newPassword){
        this.$vux.toast.show({
           type:'text',
           text: '两次密码输入不一致',
           position:'middle'
          })
          return
      }
      let params = {
        OldPassword: this.oldPassword,
        NewPassword: this.newPassword
      };
      this.$vux.loading.show({
          text: 'Loading'
        })
      Api.updatePassword(params).then(res=>{
        /*弹框返回登录页*/
        /*todo clear localstroge*/
        this.$vux.loading.hide();
        store.clear();
        store.set('defaultAccount',this.$store.state.defaultAccount);
        commonApi.androidApi.showDialog({
          msg: "修改密码成功,请重新登录",
          leftButton: "重新登录",
          leftEvent: "logout()"
        });
      }).catch(err=>{
        this.$vux.loading.hide();
      })
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
  },
  data () {
    return {
      oldPassword:'',
      newPassword:'',
      confirmPassword:''
    }
  }
}
</script>
<style lang='less' >
.nb-changePassword{
  padding: 40px 30px 0;
}
.nb-form-desc{
  margin-top:20px;
  color:#666;
  font-size:24px;
  text-align:right;

}
</style>
