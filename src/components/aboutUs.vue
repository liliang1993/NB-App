<template>
  <div>
    <x-header slot="header"
        class='view-header'
        :left-options="leftOptions"
        :right-options="rightOptions"
        title="关于我们"
        :transition="headerTransition"
       >
        <div class="nb-header-left" slot='overwrite-left' @click='$router.push({path:"/account"})'>
              <i  class='header-back-icon'>
              </i>
        </div>
    </x-header>
    <div class='nb-logo-bar'>
        <img class='logo' src="../assets/logo.png" alt="">
        <h2 class='logo-text'>{{$store.state.appVersion}}</h2>
    </div>
    <group>
      <cell title="公司简介"  is-link link='/aboutUs/profile'></cell>
      <cell title="联系客服"  is-link link='/other/support'></cell>
      <cell title="当前版本" :value="$store.state.appVersion" @click.native = 'checkVersion'></cell>
    </group>
  </div>
</template>


<script>
import {Group,Cell,XHeader } from 'vux'
import commonApi from '../Api/androidApi'
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
  .logo-text{
      margin-top:10px;
      font-size:32px;
      color:#666;
      font-weight:normal;
  }
</style>
