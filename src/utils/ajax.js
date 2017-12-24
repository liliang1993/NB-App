import axios from 'axios'
import store from '../vuex/store'
import Vue from 'vue'
import md5 from 'js-md5';
import {
  base64
} from 'vux'
import commonApi from '../Api/androidApi'
// import qs from 'qs'
// import config from "../config/";
// console.log('address', config.apiAddress);
// import * as _ from '../util/tool'
axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.timeout = 50000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
// axios.defaults.baseURL = config.apiAddress;
//配置接口地址
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  //在发送请求之前做某件事

  return config;
}, (error) => {
  // _.toast("错误的传参", 'fail');
  // window.nb.log('123', error);
  // Vux.$vux.loading.hide();
  return Promise.reject(error);
});
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
  //对响应数据做些事
  // Vux.$vux.loading.hide();
  if (res.data.Code !== 0) {
    Vue.$vux.toast.show({
      type: 'text',
      isShowMask: false,
      text: res.data.Message,
      position: 'middle',
      width: 'auto'
    })
    if (res.data.Code === 1002) {
      this.$store.dispatch('clearUserInfo');
      this.$store.dispatch('clearConfigs');
      this.$store.dispatch('updateToken',{});
      store.clear();
      commonApi.androidApi.setTokenExpired();
      // this.$router.push({
      //     path: '/account/guid'
      //   })
      // console.log('12390', res);
    }
    return Promise.reject(res.data.Message);
  }
  return res;
}, (error) => {
  // Vux.$vux.loading.hide();
  // if (error.data.Code == 1001) {
  //   store.dispatch('logout');
  //   router.push({
  //     path: '/login'
  //   })
  // }
  // _.toast("网络异常", 'fail');
  Vue.$vux.toast.show({
    type: 'text',
    isShowMask: false,
    text: '网络异常',
    position: 'middle'
  })
  return Promise.reject('网络异常');
});
//返回一个Promise(发送post请求)
export default {
  // get: (url, params, tokenFlag) => {
  //   return new Promise((resolve, reject) => {
  //     axios({
  //         method: 'get',
  //         url: url
  //       })
  //       .then(response => {
  //         resolve(response.data);
  //       }, err => {
  //         reject(err);
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  post: (url, params, tokenFlag) => {
    return new Promise((resolve, reject) => {
      let json;
      if (params) {
        json = base64.encode(JSON.stringify(params));
      } else {
        json = ''
      }
      let iat = new Date().getTime();

      let sign = md5(url + json + iat);
      console.log('url', url + json + iat, sign, json);
      let headers = {
        Iat: iat,
        Sign: sign
      }
      if (tokenFlag && store.state.user.token) {
        headers.AuthToken = store.state.user.token.AuthToken;
      }
      axios({
          method: 'post',
          url: url,
          data: params,
          headers: headers
        })
        .then(response => {
          console.log('url2', url + json + iat, sign, json);
          resolve(response.data);
        }, err => {
          console.log('url3', err, url + json + iat, sign, json);
          reject(err);
        })
        .catch((error) => {
          console.log('url3', error, url + json + iat, sign, json);
          reject(error)
        })
    })
  }
}
