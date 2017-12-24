<template>
  <div class='nb-withdraw'>
    <x-header slot="header"
    style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    class='vux-1px-b'
    :left-options="leftOptions"
    :right-options="rightOptions"
    :title="title"
    @on-click-back = 'onClickBack'
    >
    </x-header>
    <div class= 'nb-withdraw-bd'>
      <div class='nb-withdraw-bd-box'>
        <div class='mainPage'>
          <div class="nb-wrap">
            <div class="nb-cell-tip">
              出金银行卡姓名必须与网站实名一致
            </div>
            <div class='nb-withdraw-mainPage-bd'>
              <group class='nbui-cell-group'>
                <x-input class='readonly-cell' label-width='2.5rem' title="手机号" :readonly='true' :value='$store.state.user.userInfo.Phone'>
                </x-input>
              </group>

              <group class='nbui-cell-group' label-width='2.5rem'>
                <cell title="银行卡号" is-link class='cell-right-1px' primary = 'content' @click.native='sliderShow = true' v-model='bankAccount'></cell>
              </group>
              <group class='nbui-cell-group'>
                <x-input class='readonly-cell' label-width='2.5rem'  title="可用余额"  :readonly = 'true'  :value='freeMarginComputed'>
                </x-input>
              </group>
              <group class='nbui-cell-group'>
                <x-input title="出金金额" label-width='2.5rem'  :show-clear="false" class="weui-vcode" v-model='withdrawalBalance'>
                  <div slot="right" class='nb-btn_mini nb-btn_primary' @click='withdrawAll'>全部出金</div>
                </x-input>
              </group>
              <!--     <div class="nb-form-desc">
                  当前汇率： $1=6.582 <span style='color:red;'>¥0.00</span>
              </div> -->
              <div class='nb-icon-warning-wrapper'>
                <i class='nb-icon-warning' @click='showWarning = true'></i>
              </div>
              <div class="nb-btn_submit nb-btn_primary" @click = 'applyWithdraw'>
                      确定
              </div>
            </div>  
          </div>
        </div>
        <div class='bankCardList-wrapper' v-show='sliderShow'>
          <bankCard-list  class='sliderPage' @onClickBack='sliderShow = false'  @selectItem = 'selectItem'></bankCard-list>
        </div>
        <div v-show='showWarning' class='withdraw-warning-box'>
          <div class='withdraw-warning-box-hd'>
            取款注意事项
          </div>
          <div class ='withdraw-warning-box-bd'>
            <div class ='withdraw-warning-text'>
              <h2>晋峰环球国际客户取款一般不收取手续，但以下特殊情况以外:</h2>
              <p>①如客户单次取款少于50美元将统一收取3美元手续费用。</p>
              <p>②如客户总存入金额的20%不曾用于建仓交易，或者在最近一次存款后未进行建仓交易，取款时将收取6%的手续费</p>
            </div>
          </div>
        </div>
      </div>
    </div>  
    
  </div>
</template>


<script>
import {Group,XInput,
    XButton,Cell,XHeader,Drawer} from 'vux'
import bankCardList from 'components/bankCardList'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import {formatBankAcount,formatString} from 'utils/utils'
import {mapState} from 'vuex'
export default {
  name:'withdraw',
  components: {
    Group,
    XInput,
    XButton,
    Cell,
    XHeader,
    Drawer,
    bankCardList
  },
  data(){
    return {
      bankAccount:'',
      withdrawalBalance:'',
      sliderShow:false,
      showWarning: false
    }
  },
  methods:{
    clearDot(str){
      str = str.replace(/,/g, "");//取消字符串中出现的所有逗号 
      return str; 
    },
    onClickBack(){
      if( this.sliderShow ){
        this.sliderShow = false;
      } else if ( this.showWarning ) {
        this.showWarning = false;
      } else {
        // this.$router.go(-1);
        this.goBackRoute();
      }
    },
    withdrawAll(){
        this.withdrawalBalance = this.freeMarginComputed;
    },
    applyWithdraw(){
      if(this.bankAccount ==''){
        this.$vux.toast.show({
          type:'text',
          text: '请选择银行卡',
          width:'auto'
        });
        return;
      }
      if(this.withdrawalBalance ==''){
        this.$vux.toast.show({
          type:'text',
          text: '请输入出金金额',
          width:'auto'
        });
        return;
      }
      if( this.withdrawalBalanceComputed > parseFloat(this.freeMargin) ){
        this.$vux.toast.show({
          type:'text',
          text: '出金金额不能大于可用余额',
          width:'auto'
        });
        return;
      }
      this.$vux.loading.show({
       text: 'Loading'
      })
      Api.applyWithdraw({Amount:this.withdrawalBalanceComputed}).then(res=>{
        this.$vux.loading.hide();
          commonApi.androidApi.showDialog({
                msg: "出金成功！",
                leftButton: "返回资金",
                leftEvent: "changeRoute('/capital')",
              });
      }).catch(err=>{
        this.$vux.loading.hide();
      })
    },
    selectItem(bankAccount){
      this.sliderShow = false;
      console.log('account',bankAccount);
      this.bankAccount = formatBankAcount(bankAccount);
    }
  },
  mounted(){
    commonApi.androidApi.log('freeMargin',this.freeMargin);
    
  },
  computed:{
    leftOptions () {
      return {
        // showBack: this.route.path !== '/'
        preventGoBack: true,
        backText: ''
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    // headerTransition () {
    //   return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    // },
    title() {
      return this.sliderShow ? '选择银行卡' : '出金'
    },
    ...mapState({
      freeMargin: state => state.capital.floatData.freeMargin,
      margin: state => state.capital.funds.margin,
      credit: state => state.capital.funds.credit
    }),
    withdrawalBalanceComputed(){
     return parseFloat(this.clearDot(this.withdrawalBalance));
    },
    freeMarginComputed(){
      let out = Math.min(this.freeMargin, this.freeMargin +this.margin - this.credit)
      commonApi.androidApi.log('freeMagrinComputed',out); 
      return formatString(parseFloat(out), 2, 2);
    }
  }
}
</script>
<style lang='less' scoped>
  .nb-withdraw {
    position:relative;
    height:100%;top:0px;
  }
  .nb-withdraw-bd {
    position: relative;
    height: 100%;
  }
  .nb-withdraw-bd-box{
    position: relative;
    padding-top: 46PX;
    height: 100%;
  }
  .nb-cell-tip{
    background-color: #eee;
    padding: 20px 0;
    padding-left: 30px;
  }
  .nb-withdraw-mainPage-bd{
    padding:40px 30px 0;
  }
  .mainPage{
    position: absolute;
    width: 100%;
    top:0;
    left:0;
  }
  .bankCardList-wrapper{
    padding-top: 46PX;
    position: relative;
    height:100%;
  }
  .sliderPage{
    position: absolute;
    top:0;
    left:0;
    width:100%;
  }
  .nb-icon-warning-wrapper{
    margin-top: 20px ;
    text-align: right;
  }
  .nb-icon-warning {
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(../../assets/capital/icon-help.png) no-repeat center;
    background-size: contain ;
  }
  .withdraw-warning-box {
    position: relative;
    height:100%;
    background-color: #fff;
    padding-top: 30px;
  }
  .withdraw-warning-box-hd {
    background-color: #48bed4;
    color: #fff;
    height: 80px;
    font-size: 30px;
    line-height: 80px;
    padding-left: 30px;
  }
  .withdraw-warning-box-bd {
    padding: 30px;
  }
  .withdraw-warning-text {
    border: 1PX solid #ccc;
    padding: 30px;
    font-size: 30px;
    line-height: 1.5;
    h2 {
      color: #000;
    }
    p {
      margin-top: 30px;
      color: #999;
    }
  }
</style>

