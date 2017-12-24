import commonApi from './androidApi.js'
import store from '../vuex/store'
import {
  formatString
} from '../utils/utils'
import Api from './api'
/*与原生的接口*/

window.changeRoute = function(path) {
  commonApi.androidApi.log('path');
  commonApi.androidApi.log(path);
  // if(path !== undefined){
  //   window.vue.$router.push({path: path});
  // }
    window.location.hash = path;

  // commonApi.androidApi.log('hash1', hash);
};      
window.checkToken = function() {
  console.log('checkToken');
  Api.getUser().then(res => {
    store.dispatch('updateUserInfo', res.Data);
    console.log('CustomerConfigInfos',)
    if(res.CustomerConfigInfos.length!==0){
      let obj = {};
      res.CustomerConfigInfos.map((item,index)=>{
        obj[item.ConfigKey] = item.ConfigValue
      });
      store.dispatch('updateConfigs',obj);
      console.log('checkTokenSuccess');
    }
    commonApi.androidApi.checkTokenSuccess(store.state.user.token.AuthToken,store.state.user.userInfo.Mt4Account,store.state.account.configs.customSymbolList,store.state.account.configs.quickOrder,store.state.account.configs.quicklyClose,store.state.account.configs.sendMessage,store.state.account.configs.tradeNoise   
    );
  }).catch(err => {
    console.log('checkTokenFail');
    commonApi.androidApi.checkTokenFail(err);
  })
};

window.getConfig = function(key) {
  Api.getConfigInfoList().then(res => {
    if (res.Data) {
      var obj = {};
      res.Data.map((item, index) => {
        obj[item.ConfigKey] = item.ConfigValue
      });
      store.dispatch('updateConfigs', obj);
    };
    // commonApi.androidApi.log('configSuccess', store.state.account.configs[key]);
    commonApi.androidApi.getConfigSuccess(store.state.account.configs[key]);
  }).catch(err => {
    // commonApi.androidApi.log('Configsfail2', err);
    commonApi.androidApi.getConfigFail(err);
  })
};

window.setConfig = function(key, value) {

  Api.updateBatchConfigInfo([{
    ConfigKey: key,
    ConfigValue: value
  }]).then(res => {
    commonApi.androidApi.setConfigSuccess();
  }).catch(err => {
    // commonApi.androidApi.log('err',key,value);
    commonApi.androidApi.setConfigFail(err);
  })
};
window.setFirstSymbol = function(name, cName, price, digits) {
  let dict;
  dict = {
    name: name,
    cName: cName,
    price: parseFloat(price).toFixed(digits),
    digits: digits,
    bgc: '#00b876',
  };
  store.dispatch("updateFirstSymbol", dict);
  // commonApi.androidApi.log('firstSysmbol', digits);
};
window.setFirstPrice = function(price, digits) {
  let prevPrice = store.state.symbol.firstSymbol.price;
  let nowPrice = parseFloat(price).toFixed(digits);
  var dict = {
    price: nowPrice
  };
  // commonApi.androidApi.log('fPrice', nowPrice);
  // commonApi.androidApi.log('fprevPrice', prevPrice);
  if (nowPrice < prevPrice) {
    dict.bgc = "#f56262";
  } else {
    dict.bgc = "#00b876";
  }
  // commonApi.androidApi.log('firstdigits', digits);
  // commonApi.androidApi.log('firstprice');
  store.dispatch("updateFirstSymbol", dict);
};
let prevPrice = 0;
window.setSecondSymbol = function(name, cName, price, digits) {
  let dict;
  dict = {
    name: name,
    cName: cName,
    price: parseFloat(price).toFixed(digits),
    digits: digits,
    bgc: '#00b876',
  };
  store.dispatch("updateSecondSymbol", dict);
};

window.setSecondPrice = function(price, digits) {
    let prevPrice = store.state.symbol.secondSymbol.price;
    let nowPrice = parseFloat(price).toFixed(digits);
    var dict = {
      price: nowPrice
    };
    // commonApi.androidApi.log('price', nowPrice);
    // commonApi.androidApi.log('prevPrice', prevPrice);
    if (nowPrice < prevPrice) {
      dict.bgc = "#f56262";
    } else {
      dict.bgc = "#00b876";
    }
    // commonApi.androidApi.log('seconddigits', digits);
    // commonApi.androidApi.log('secondprice');
    store.dispatch("updateSecondSymbol", dict);
  }
  /**
   * [setFunds 设置资金类数据]
   * @param {[type]} balance [资金]
   * @param {[type]} credit  [信用金]
   * @param {[type]} margin  [已用保证金]
   */
window.setFunds = function(balance, credit, margin) {
  var funds = {
    balance: parseFloat(balance),
    credit: parseFloat(credit),
    margin: parseFloat(margin)
  };
  // commonApi.androidApi.log('setFunds');
  store.dispatch("updateFunds", funds);
};
/**
 * 
 * @param {string} freeMargin 可用保证金
 * @param {string} equity   净值
 * @param {string} profit  浮动盈亏
 */
window.setFloatData = function(freeMargin, equity, profit) {
  var floatData = {
    freeMargin: parseFloat(freeMargin),
    equity: parseFloat(equity),
    profit: parseFloat(profit)
  };
  // commonApi.androidApi.log('setFloatData', floatData.freeMargin);
  store.dispatch("updateFloatData", floatData);

};
/**用于修改密码后返回登录时清除原生的登录状态*/
window.logout = function(){
  commonApi.androidApi.logout();
}

/**
 * 
 *用于版本设置
 */
window.setVersion = function (version){
  console.log('liliang', version);
  store.dispatch("updateVersion", version);
}