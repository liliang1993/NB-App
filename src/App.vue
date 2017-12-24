<template>
  <div style="height:100%;">
    <div v-transfer-dom>
      <!-- <loading v-model="isLoading"></loading> -->
      <loading v-if='isLoading'></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
    </div>
      <view-box class='view-box' ref="viewBox" :body-padding-top="isShowHeader ? '46px' : '0'"  body-padding-bottom="0px">
        <x-header slot="header"
        v-if='isShowHeader'
        style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        class='vux-1px-b'
        :class="headerClass"
        :left-options="leftOptions"
        :right-options="rightOptions"
        :title="title"
        @on-click-back ='goBackRoute'
        @on-click-more="onClickMore">
          <span v-if="route.path === '/' || route.path === '/account'" slot="right"  @click="$router.push({path:'/other/support'})">
              <i class='nbui-icon nbui-icon_support'></i>
          </span>
        </x-header>  
        <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
          <!-- <keep-alive>
            <router-view v-if="route.meta.keepAlive"  class="router-view"></router-view>
          </keep-alive> -->
            <router-view  class="router-view"></router-view>
      </view-box>
  </div>
</template>

<script>
import { Radio, Group, Cell, Badge, Drawer, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, TransferDom } from 'vux'
import Loading from 'components/loading'
import { mapState, mapActions } from 'vuex'
// import {
//   changeRoute
// } from './utils/utils'
import store from '_vuex/store'
import localStroge from 'storejs'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import {MenuList} from 'configs/configs'
import 'api/webApi.js'

export default {
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    Cell,
    Badge,
    Drawer,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    Actionsheet
  },
  data () {
    return {
      showMenu: false,
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en': 'English'
      },
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      showPlacementValue: 'left',
      articleMenuList: MenuList
    }
  },
  methods: {
    onShowModeChange (val) {
      /** hide drawer before changing showMode **/
      this.drawerVisibility = false
      setTimeout(one => {
        this.showModeValue = val
      }, 400)
    },
    onPlacementChange (val) {
      /** hide drawer before changing position **/
      this.drawerVisibility = false
      setTimeout(one => {
        this.showPlacementValue = val
      }, 400)
    },
    onClickMore () {
      this.showMenu = true
    },
    changeLocale (locale) {
      this.$i18n.set(locale);
      this.$locale.set(locale)
    },
    ...mapActions([
      'updateDemoPosition'
    ])
  },
  beforeCreate () {
    // Api.getLatestVersion().then(res=>{

    // })
  },
  mounted () {

  },
  watch:{
    '$route': (to,from)=>{
        console.log('$router');
        commonApi.androidApi.log('path',to.path,from.path);
        commonApi.androidApi.setUrlHash(to.path);
    }
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.global.demoScrollTop,
      isLoading: state => state.global.isLoading,
      direction: state => state.global.direction
    }),
    headerClass () {
      if ( this.route.path == '/capital' || this.route.path == '/account') {
         return 'blank-bg-color-header'
      }
    },
    isShowHeader() {
      if( this.route.path === '/guide' || this.route.path === '/home' ||  this.route.path === '/menu/menuList' || this.route.path === '/capital/orderList' || this.route.path === '/capital/depositApply' || this.route.path === '/capital/withdrawApply' ||this.route.path === '/account/register' ||this.route.path === '/account/resetPassword' || this.route.path === '/account/bindBank'){
          return false;
      }
      return true;
    },
    isAccessDetailRoute(){
      console.log('123',/accessDetail/.test(this.route.path));
      return /accessDetail/.test(this.route.path);
    },
    leftOptions () {
      return {
        showBack: this.isShowBack,
        preventGoBack: true,
        backText: ''
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    isShowBack () {
      console.log('path',this.route.path.split('/'));
      return (this.route.path.split('/')).length-1 > 1
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    // componentName () {
    //   if (this.route.path) {
    //     const parts = this.route.path.split('/')
    //     if (/component/.test(this.route.path) && parts[2]) return parts[2]
    //   }
    // },
    // isDemo () {
    //   return /component|demo/.test(this.route.path)
    // },
    // isTabbarDemo () {
    //   return /tabbar/.test(this.route.path)
    // },
    title () {
      console.log('route',this.route.path)
      if (this.route.path === '/account/login') return '登录'
      if (this.route.path === '/account/resetPassword') return '重置密码'
      if (this.route.path === '/account/register') return '注册账号'
      if (this.route.path === '/account') return '我的'
      if (this.route.path === '/account/certification') return '实名认证'
      if (this.route.path === '/account/changePassword') return '修改密码'
      if (this.route.path === '/account/tradeSetting') return '交易设置'
      if (this.route.path === '/account/aboutUs') return '关于我们'
      if (this.route.path === '/aboutUs/profile') return '公司简介'
      if (this.route.path === '/other/support') return '在线客服'
      if (this.route.path === '/account/customerAgreement') return '客户协议'
      if (this.route.path === '/capital')  return '资金'
      if (this.route.path === '/account/personalInfo')  return '个人信息' 
      if (this.route.path === '/account/bankCardList')  return '已绑定银行卡'
      if (this.route.path === '/article/details')  return this.route.query.menuName
      // if (/order\/detail/.test(this.route.path) && this.route.query.type == 'deposit' ) return '入金明细'
      // if (/order\/detail/.test(this.route.path) && this.route.query.type == 'withdraw') return '出金明细'

      if (this.route.path === '/project/donate') return 'Donate'
      if (this.route.path === '/demo') return 'Demo list'
      return this.componentName ? `Demo/${this.componentName}` : 'Demo/~~'
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
@import "~tachyons-flexbox/css/tachyons-flexbox.min.css";
@import './Styles/reset.less';
@import './Styles/widget/header.less';
@import './Styles/widget/cell.less';
@import './Styles/widget/btn.less';
@import './Styles/widget/toast.less';
@import './Styles/widget/alert.less';



.nbui-icon_support{
  display: inline-block;
  width: 25PX;
  height: 25PX;
  position:relative;
  top:-3PX;
  left:-3PX;
  background: url(./assets/global/header-icon-right.png) no-repeat center;
  background-size:contain;
}
.vux-header.blank-bg-color-header{
  background-color: #000;
  .vux-header-title{
    color:#fff;
  }
}
body {
  background-color: #fff;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

.router-view {
  width: 100%;
}

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46PX;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.menu-title {
  color: #888;
}
</style>
