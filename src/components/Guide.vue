<template>
  <div class='nb-guide-box'>
    <div class="nb-logo-bar">
      <img class="nb-guide-logo" src="../assets/logo.png">
    </div>
    <div class="login-group">
      <div class="radius-button bgc-btn" link='/Login' @click="$router.push({path:'/account/login'})">
          登录
      </div>
    </div>
    <div class="login-group">
      <div class="radius-button no-bgc-btn" @click="$router.push({path:'/account/register'})">
            注册
      </div>
    </div>
    <!-- <div class="nb-unlogin">
        <div @click='notLogin'>暂不登录</div>
    </div> -->
  </div>
</template>

<script>
import { Group, XInput,XButton } from 'vux'
import commonApi from'../Api/androidApi'
export default {
  components: {
    Group,
    XInput,
    XButton
  },
  methods:{
     notLogin(){
        commonApi.androidApi.notLogin();
     }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  }
}
</script>

<style lang='less' scoped>
.nb-guide-box {
  padding-top: 100px;
}
.nb-guide-logo{
  width:180px;
  height:180px;
}
.nb-unlogin{
  font-size:32px;
  margin-top:66px;
  text-align:center;
}
</style>
