// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import $ from 'jquery'
import App from './APP'
import FastClick from 'fastclick'
FastClick.attach(document.body)

/**引入全局的mixins */
import  'mixins/global'

import Vuex from 'vuex'
Vue.use(Vuex);

require('es6-promise').polyfill();

import 'amfe-flexible/index.js'



import {
  sync
} from 'vuex-router-sync'
// import MintUI from 'mint-ui';
import router from 'router'

import store from '_vuex/store'
import commonApi from './Api/androidApi'

// Vue.use(MintUI);

// import {
//   IndexList,
//   IndexSection,
//   Search
// } from 'mint-ui';
// Vue.component('MtIndexList', IndexList);
// Vue.component('MtIndexSection', IndexSection);

  /*slider swiper*/
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)



import {
  DatetimePlugin,
  CloseDialogsPlugin,
  ConfigPlugin,
  BusPlugin,
  LocalePlugin,
  DevicePlugin,
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin,
  WechatPlugin,
  AjaxPlugin,
  AppPlugin
} from 'vux'

// global VUX config 阻止body滚动
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})

sync(store, router);
/**
 * history management
*/
import {isiOS} from 'utils/utils'       
/**/
router.beforeEach((to, from, next) => {
  console.log('from',to);
  if(store.state.global.isLoading){
    store.commit('updateLoadingStatus', {isLoading: false});
  }
  commonApi.androidApi.setBeforeUrlHash(to.path);
  if(to.query.direction == 'back' || !isiOS()) {
    commonApi.androidApi.log('不做任何处理的next');
    next();
  }else {
    let routerList  = store.state.routerList;
    routerList.push(from.path);
    store.commit('updateRouterList', routerList);
    // alert( to.path );
    // alert( from.path );
    commonApi.androidApi.log('to');
    commonApi.androidApi.log(to.path);
    commonApi.androidApi.log(from.path);
    next();
  }  
});

router.afterEach((to, from, next) => {
  console.log('555');
  commonApi.androidApi.log('url');
  commonApi.androidApi.log(window.location.href);
  // store.commit('updateLoadingStatus', {isLoading: false});
})
// global VUX config
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})

// plugins
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(BusPlugin)
Vue.use(DatetimePlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vue = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
