import store from '../vuex/store'
const proAndroidApi = {
  log(msg1, msg2) {
    window.nb.log(msg1, msg2);
  },
  getTokenSuccess(AuthToken, Mt4Account, customSymbolList, quickOrder, quicklyClose, sendMessage, tradeNoise  ) {
    window.nb.getTokenSuccess(AuthToken, Mt4Account, customSymbolList,quickOrder, quicklyClose, sendMessage, tradeNoise);
  },
  getTokenFail(err) {
    window.nb.getTokenFail(err);
  },
  checkTokenSuccess(AuthToken, Mt4Account, customSymbolList, quickOrder, quicklyClose, sendMessage, tradeNoise) {
    window.nb.checkTokenSuccess(AuthToken, Mt4Account, customSymbolList, quickOrder, quicklyClose, sendMessage, tradeNoise);
  },
  checkTokenFail(err) {
    window.nb.checkTokenFail(err);
  },
  setTokenExpired() {
    window.nb.setTokenExpired();
  },
  setBeforeUrlHash(toPath) {
    window.nb.setBeforeUrlHash(toPath);
  },
  setUrlHash(toPath) {
    window.nb.setUrlHash(toPath);
  },
  jumpToOrder() {
    window.nb.jumpToOrder();
  },
  jumpToTrade() {
    window.nb.jumpToTrade();
  },
  onSetTimeSuccess(startTime, endTime) {
    window.nb.onSetTimeSuccess(startTime, endTime);
  },
  onSetTimeCancel() {
    window.nb.onSetTimeCancel();
  },
  getConfigSuccess(value) {
    window.nb.getConfigSuccess(value);
  },
  getConfigFail(err) {
    window.nb.getConfigFail(err);
  },
  setConfigSuccess() {
    window.nb.setConfigSuccess();
  },
  setConfigFail(err) {
    window.nb.setConfigFail(err);
  },
  notLogin() {
    window.nb.notLogin();
  },
  logout() {
    window.nb.logout();
  },
  /**
   * 入金将入金网址传给原生
   * @param {} url 
   */
  toNewWindow(url){
    window.nb.log('创建新的webview：'+url);
    window.nb.toNewWindow(url);
  },
  /**
   * 获得版本号
   */
  getVersion () {
    window.nb.getVersion();
  },
  /**
   * 判断是否有版本更新
   */
  checkVersion () {
    window.nb.checkVersion();
  }, 

  /**
   * 同步更新交易设置到原生
   * 
   */
  setConfigInfo(quickOrder, quicklyClose, sendMessage, tradeNoise) {
    window.nb.setConfigInfo(quickOrder, quicklyClose, sendMessage, tradeNoise);
  },
  /**
   * 
   * type: 0:普通弹框显示传入的msg  
   *       1：用于快速下单 不处理msg显示下单协议
   *       2：用于快速平仓 不处理msg显示平仓协议
   */
  showDialog(Obj){
    let Default = {
        type: 0,
        msg:'',
        leftButton: '',
        rightButton: '',
        leftEvent: '',
        rightEvent: ''
    };
    let params = Object.assign({}, Default, Obj);
    window.nb.showDialog(params.type, params.msg, params.leftButton, params.rightButton, params.leftEvent, params.rightEvent );
  }
}

let isDev = process.env.NODE_ENV == 'development' ? true :false;
for (let f of Object.keys(proAndroidApi)) {
  let of = proAndroidApi[f];
  proAndroidApi[f] = function() {
    !isDev && of.apply(this, arguments);
  }
}
export default {
  androidApi: proAndroidApi
}
