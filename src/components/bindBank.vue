<template>
<div class='nb-bindBank'>
  <x-header slot="header"
      style="width:100%;position:fixed;left:0;top:0;z-index:100;"
      class='vux-1px-b'
      :left-options="leftOptions"
      :right-options="rightOptions"
      title="绑定银行"
      @on-click-back = 'onClickBack'
     >
  </x-header>
  <div class='nb-bindBank-wrapper' >
    <div class='nb-bindBank-box' v-show='!showBankList'>
      <group class='nbui-cell-group'>
        <x-input label-width='5em' title="持卡人" :value='$store.state.user.userInfo.RealName' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='5em' title="银行账户"  mask='9999 9999 9999 9999 9999' v-model='bankAccount' placeholder='请输入出金银行账号' @on-change='onChange'>
        </x-input>
      </group>
      <group class='nbui-cell-group' label-width='5em'>
        <cell class='cell-right-1px' primary='content' title="支付银行"  is-link @click.native='showBankList=true' :value='bankName'></cell>
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='5em' title="开户支行" v-model='bankAddress' placeholder='例:招商银行深圳分行南山支行'>
        </x-input>
      </group>

      <div class="nb-btn_submit nb-btn_primary" @click='bindBankCard'>
              确定
      </div>
    </div>
  </div>
  <transition >
      <div class='nb-bindBank-wrapper' v-if='showBankList'>
        <bank-list   :dataList = 'bankDictComputed'  @selectList = 'selectList'>
        </bank-list>
      </div>
  </transition>
</div>
</template>


<script>
import {Group,XInput,
    XButton,XHeader,Cell} from 'vux'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import BankList from 'views/bankCard/bankList.vue'
import{BankDict} from 'configs/configs'
// import Bin from 'bankcardinfo'
var BIN = require('bankcardinfo');
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader,
    Cell,
    BankList
  },
  methods:{
    bindBankCard(){
      if(this.bankAccount == ''|| this.bankAddress == '' || this.bankName == '' ){
        this.$vux.toast.show({
          type:'text',
          text: '请填写完整信息',
          width:'auto'
        });
        return;
      }
      console.log('this.bankAccount',this.bankAccount);
      if(!this.checkBankCard(this.bankAccountComputed)){
        this.$vux.toast.show({
          type:'text',
          text: '银行账号格式不合法',
          width:'auto'
        });
        return;
      }
      let rightButtonText,rightEvent;
      let params = {
        BankName: this.bankName,
        BankAccount: this.bankAccountComputed,
        BankAddress: this.bankAddress
      };
      
      this.$vux.loading.show({
        text: 'loading'
      })
      Api.bindBankCard(params).then(res=>{
        this.$vux.loading.hide();
        this.$store.dispatch('updateUserInfo',params);
          if(this.$store.state.route.from.path == '/account'){
            if(!this.$store.state.user.userInfo.IsUploadIdCard){
              rightButtonText = '前往实名认证';
              rightEvent = "changeRoute('/account/certification')"
            }else{
              rightButtonText = '',
              rightEvent  = ''
            }
            commonApi.androidApi.showDialog({
              msg: "绑定银行卡成功！",
              leftButton: "返回我的",
              rightButton: rightButtonText,
              leftEvent: "changeRoute('/account')",
              rightEvent: rightEvent
            });
            return;
          };
          if(this.$store.state.route.from.path == '/capital'){
            commonApi.androidApi.showDialog({
              msg: "绑定银行卡成功！",
              leftButton: "前往出金",
              leftEvent: "changeRoute('/capital/withdrawApply')",
            });
            return;
          };
      }).catch(err=>{
        this.$vux.loading.hide();
      })
    },
    /*--------------------------------银行卡----------------------------------------*/
    //Description:  银行卡号Luhm校验
    //Luhm校验规则：16位银行卡号（19位通用）:
    // 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
    // 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
    // 3.将加法和加上校验位能被 10 整除。

    //方法步骤很清晰，易理解，需要在页面引用Jquery.js
    checkBankCard(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）

        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9

        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;

        if (lastNum == luhm) {
            return true;
        } else {
            return false;
        }
    },

    onChange(){
      BIN.getBankBin(this.bankAccountComputed).then(data=>{
          this.bankName = data.bankName;
      }).catch(err=>{
          this.bankName = '';
      })
    },
    onClickBack () {
      if(this.showBankList){
        this.showBankList = false;
      }else {
        // this.$router.go(-1);
        this.goBackRoute();
      }
    },
    selectList(item){
      this.bankName = item.name;
      this.showBankList = false;
    }
  },
  computed:{

    leftOptions () {
      return {
        // showBack: this.route.path !== '/'
        preventGoBack : true,
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
    },
    bankAccountComputed() {
      return this.bankAccount.replace(/\s+/g,"");
    },
    bankDictComputed () {
      return BankDict.filter(item => {
          return item.logo !=='QQPay' && item.logo !=='WeChatPay' && item.logo !=='AliPay'
        });
    }
  },
  data () {
    return {
        bankAccount:'',
        bankName:'',
        bankAddress:'',
        showBankList: false
    }
  }
}
</script>
<style lang='less' scoped>
  .nb-bindBank{
    position:relative;
    height:100%;
    top:0;
    .nb-bindBank-wrapper{
      position: absolute;
      width:100%;
      height:100%;
      padding-top: 46PX;
      left:0;
    }
    .nb-bindBank-box {
      padding: 40px 30px 0;
    }
    .banklist-wrapper{
      position: absolute;
      width:100%;
      left:0;
      &.fade-enter-active, &.fade-leave-active{
        transition: all 0.5s ease
      }
      &.fade-enter, &.fade-leave-active{
        left:100%;
      }
    }
  }

</style>
