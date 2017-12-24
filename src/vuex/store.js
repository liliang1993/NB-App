import Vue from 'vue'
import Vuex from 'vuex'
import store from 'storejs'
Vue.use(Vuex)

const user = {
  state: {
    userInfo: store.get('userInfo') || {},
    token: store.get('token') || {}
  },
  mutations: {
    updateUserInfo(state, userInfo) {
      Object.assign(state.userInfo, userInfo);
      store.set('userInfo', state.userInfo);
    },
    clearUserInfo (state) {
      state.userInfo = {};
      store.clear('userInfo');
    },
    updateToken(state, token) {
      state.token = token;
      store.set('token', token);
    },
    resetState(state) {
      console.log('state', state);
      state = null;
    }
  },
  actions: {
    updateUserInfo({
      commit
    }, userInfo) {
      commit('updateUserInfo', userInfo)
    },
    clearUserInfo({
      commit
    }) {
      commit('clearUserInfo')
    },
    updateToken({
      commit
    }, token) {
      commit('updateToken', token)
    },
    resetState({
      commit
    }) {
      commit('resetState');
    },
  }
}
const state = {
  bankCardInfo: store.get('bankCardInfo') || null,
  selectBankName: '',
  defaultAccount: store.get('defaultAccount') || '',
  appVersion: '',
  routerList: []
}
const mutations = {
  updateBankCardInfo(state, bankCardInfo) {
    state.bankCardInfo = bankCardInfo;
    store.set('bankCardInfo', bankCardInfo);
  },
  updateSelectBankName(state, selectBankName) {
    state.selectBankName = selectBankName;
  },
  updateDefaultAccount(state, defaultAccount) {
    state.defaultAccount = defaultAccount;
    store.set('defaultAccount', defaultAccount);
  },
  updateVersion(state, version) {
    state.appVersion = version;
  },
  updateRouterList(state, list) {
    state.routerList = list;
  }
}
const actions = {
  updateBankCardInfo({
    commit
  }, updateBankCardInfo) {
    commit('updateBankCardInfo', updateBankCardInfo)
  },
  updateDefaultAccount({
    commit
  }, updateDefaultAccount) {
    commit('updateDefaultAccount', updateDefaultAccount)
  },
  updateSelectBankName({
    commit
  }, updateSelectBankName) {
    commit('updateSelectBankName', updateSelectBankName)
  },
  updateVersion({
    commit
  }, version) {
    commit('updateVersion', version)
  },
  updateRouterList({
    commit
  }, list) {
    commit('updateRouterList', list)
  }
}

const capital = {
  state: {
    funds: {
      balance: "",
      credit: "",
      margin: ""
    },
    floatData: {
      freeMargin: "",
      equity: "",
      margin_level: "",
      profit: ""
    }
  },
  mutations: {
    updateFunds(state, funds) {
      state.funds = funds;
    },
    updateFloatData(state, floatData) {
      state.floatData = floatData;
    }
  },
  actions: {
    updateFunds({
      commit
    }, funds) {
      commit('updateFunds', funds)
    },
    updateFloatData({
      commit
    }, floatData) {
      commit('updateFloatData', floatData)
    }
  }
}

const account = {
  state: {
    configs: store.get('configs')||{
      quickOrder: 'false',
      quicklyClose: 'false',
      sendMessage: 'false',
      tradeNoise: 'false',
      customSymbolList:''
    }
  },
  mutations: {
    updateConfigs(state, configs) {
      Object.assign(state.configs,{
        quickOrder: 'false',
        quicklyClose: 'false',
        sendMessage: 'false',
        tradeNoise: 'false',
        customSymbolList:''
      },configs);
      store.set('configs', state.configs);
    },
    clearConfigs(state) {
      state.configs = {}
      store.clear('configs');
    }
  },
  actions: {
    updateConfigs({
      commit
    }, configs) {
      commit('updateConfigs', configs)
    },
    clearConfigs({
      commit
    }) {
      commit('clearConfigs')
    }
  }
}
const symbol = {
  state: {
    firstSymbol: {
      name: '',
      cName: '',
      price: '',
      digits: '',
      bgc: ''
    },
    secondSymbol: {
      name: '',
      cName: '',
      price: '',
      digits: '',
      bgc: ''
    }
  },
  mutations: {
    updateFirstSymbol(state, dict) {
      Object.assign(state.firstSymbol, dict);
    },
    updateSecondSymbol(state, dict) {
      Object.assign(state.secondSymbol, dict);
    }
  },
  actions: {
    updateFirstSymbol({
      commit
    }, dict) {
      commit('updateFirstSymbol', dict)
    },
    updateSecondSymbol({
      commit
    }, dict) {
      commit('updateSecondSymbol', dict)
    }
  }
}
const global = {
  state: {
    demoScrollTop: 0,
    isLoading: false,
    direction: 'forward'
  },
  mutations: {
    updateDemoPosition(state, payload) {
      state.demoScrollTop = payload.top
    },
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection(state, payload) {
      state.direction = payload.direction
    }
  },
  actions: {
    updateDemoPosition({
      commit
    }, top) {
      commit({
        type: 'updateDemoPosition',
        top: top
      })
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    user,
    global,
    capital,
    account,
    symbol
  }
})
