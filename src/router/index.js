import Vue from 'vue'
import Router from 'vue-router'


// import Calendar from '@/components/Calendar'
// import AndroidCalendar from '@/components/AndroidCalendar'



// import PaymentList from '@/views/payment/PaymentListPage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    redirect: '/guide'
  }, {
    path: '/account/login',
    name: 'login',
    showHeader: false,
    component: function (resolve) {
      require(['views/login/login'], resolve)
    }
  }, {
    path: '/guide',
    name: 'guide',
    showHeader: false,
    component: function (resolve) {
      require(['components/Guide'], resolve)
    }
  }, {
    path: '/capital',
    name: 'capital',
    showHeader: true,
    headerTitle: '资金',
    component: function (resolve) {
      require(['views/capital/capital'], resolve)
    }
  }, {
    path: '/account',
    name: 'account',
    showHeader: true,
    headerTitle: '我的',
    component: function (resolve) {
      require(['views/account/account'], resolve)
    }
  }, {
    path: '/account/tradeSetting',
    name: 'tradeSetting',
    showHeader: true,
    headerTitle: '交易设置',
    component: function (resolve) {
      require(['views/account/tradeSetting'], resolve)
    }
  }, {
    path: '/account/aboutUs',
    name: 'aboutUs',
    showHeader: true,
    headerTitle: '关于我们',
    component: function (resolve) {
      require(['views/aboutUs/aboutUs'], resolve)
    }
  }, {
    path: '/aboutUs/profile',
    name: 'profile',
    showHeader: true,
    headerTitle: '公司简介',
    component: function (resolve) {
      require(['views/aboutUs/profile'], resolve)
    }
  }, {
    path: '/account/resetPassword',
    name: 'ResetPassword',
    showHeader: false,
    component:function (resolve) {
      require(['views/resetPassword/resetPassword'], resolve)
    }
  }, {
    path: '/account/changePassword',
    name: 'changePassword',
    showHeader: true,
    headerTitle: '修改密码',
    component: function (resolve) {
      require(['views/account/changePassword'], resolve)
    }
  }, {
    path: '/account/register',
    name: 'register',
    showHeader: false,
    component: function (resolve) {
      require(['views/register/register'], resolve)
    }
  },  {
    path: '/home',
    name: 'home',
    showHeader: false,
    component: function (resolve) {
      require(['views/home/home'], resolve)
    },
    meta: {keepAlive: true}
  }, {
    path: '/account/bankCardList',
    name: 'bankCardList',
    showHeader: true,
    headerTitle: '已绑定银行卡',
    component: function (resolve) {
      require(['components/bankCardList'], resolve)
    }
  },
  // {
  //   path: '/cms/calendar',
  //   name: 'calendar',
  //   component: Calendar
  // },
  {
    path: '/menu/menuList',
    name: 'menuList',
    showHeader: false,
    component: function (resolve) {
      require(['views/menu/menuList'], resolve)
    }
  },
  {
    path: '/capital/depositApply',
    name: 'deposit',
    showHeader: false,
    component: function (resolve) {
      require(['views/capital/deposit'], resolve)
    }
  },{
    path: '/capital/orderList/detail',
    name: 'orderListDetail',
    component: function (resolve) {
      require(['components/OrderListDetail'], resolve)
    }
  }, {
    path: '/capital/withdrawApply',
    name: 'withdraw',
    showHeader: false,
    component: function (resolve) {
      require(['views/capital/withdraw'], resolve)
    }
  },{
    path: '/capital/orderList',
    name: ' orderListPage',
    component:  function (resolve) {
      require(['views/capital/orderListPage'], resolve)
    }
  },
  {
    path: '/account/certification',
    name: 'certification',
    showHeader: true,
    headerTitle: '实名认证',
    component: function (resolve) {
      require(['views/account/certification'], resolve)
    }
  },{
    path: '/account/bindBank',
    name: 'bindBank',
    showHeader: true,
    headerTitle: '绑定银行卡',
    component: function (resolve) {
      require(['components/bindBank'], resolve)
    }
  }, 
  {
    path: '/account/personalInfo',
    name: 'personalInfo',
    showHeader: true,
    headerTitle: '个人信息',
    component: function (resolve) {
      require(['views/account/personalInfo'], resolve)
    }
  },
  //  {
  //   path: '/androidCalendar',
  //   name: 'androidCalendar',
  //   component: function (resolve) {
  //     require(['views/login/login'], resolve)
  //   }
  // }, 
  {
    path: '/other/support',
    name: 'support',
    showHeader: true,
    headerTitle: '在线客服',
    component: function (resolve) {
      require(['views/support/support'], resolve)
    }
  },{
    path: '/payment/bankList',
    name: 'bankList',
    component: function (resolve) {
      require(['views/bankCard/bankList'], resolve)
    }
  }, 
  {
    path: '/account/customerAgreement',
    name: 'customerAgreement',
    showHeader: true,
    headerTitle: '客户协议',
    component:function (resolve) {
      require(['components/CustomerAgreement'], resolve)
    }
  }
]
})
