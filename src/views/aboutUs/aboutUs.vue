<template>
  <div>
    <div class='nb-logo-bar'>
        <img class='nb-aboutUs-logo' src="../../assets/logo.png" alt="">
        <h2 class='logo-text'>V{{$store.state.appVersion}}</h2>
    </div>
    <div class='nb-aboutUs-bd'>
      <group class='nbui-cell-group'>
        <cell title="公司简介"  is-link link='/aboutUs/profile'></cell>
        <cell title="联系客服"  is-link link='/other/support'></cell>
        <cell title="当前版本" :value="$store.state.appVersion" @click.native = 'checkVersion'></cell>
      </group>
    </div>  
  </div>
</template>


<script>
import {Group,Cell,XHeader } from 'vux'
import commonApi from 'api/androidApi'
export default {
  components: {
    Group,
    Cell,
    XHeader
  },
  methods: {
    /**
     * 判断版本是否有更新
     */
    checkVersion(){
      console.log('1231');
      commonApi.androidApi.checkVersion();
    }
  },
  mounted () {
    console.log('version');
    commonApi.androidApi.getVersion();
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
      value1: true,
      value2: false
    }
  }
}
</script>
<style lang='less'>
  .nb-aboutUs-logo{
    width:148px;
    height:148px;
  }
  .logo-text{
      background-color: #48bed4;
      width:130px;
      height: 50px;
      line-height: 50px;
      margin:30px auto 0;
      font-size:30px;
      color:#fff;
      font-weight:normal;
  }
  .nb-aboutUs-bd {
    padding-top:60px;
  }
</style>
