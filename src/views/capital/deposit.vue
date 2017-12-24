<template>
  <div class='nb-desposit'>
    <x-header slot="header"
      style="width:100%;position:fixed;left:0;top:0;z-index:100;"
      class='vux-1px-b'
      :left-options="leftOptions"
      :right-options="rightOptions"
      :title="title"
      @on-click-back = 'goback()'
     >
  </x-header>
    <div class='nb-deposit-bd'>
      <div class="nb-deposit-bd-wrapper"  >
        <div class="nb-deposit-bd-con main-page" v-show='!showBankList'>
          <group class='nbui-cell-group'>
            <x-input class='readonly-cell' label-width='6em' title="姓名" :readonly='true' v-model='$store.state.user.userInfo.RealName'>
            </x-input>
          </group>
          <group class='nbui-cell-group'>
            <x-input class='readonly-cell' title="身份证号码" label-width='6em' :readonly='true'  type='number' v-model='$store.state.user.userInfo.IDNO'>
            </x-input>
          </group>
          <group class='nbui-cell-group' >
            <x-input class='readonly-cell' title="交易账号" label-width='6em' :readonly='true' v-model='$store.state.user.userInfo.Mt4Account'>
            </x-input>
          </group>
          <group class='nbui-cell-group' >
            <x-input title="支付通道" label-width='6em' :readonly='true' placeholder='请选择通道' @click.native='showChannels = ! showChannels' v-model='currentChannelName'>
            </x-input>
          </group>
          <group class='nbui-cell-group' >
            <x-input label-width='6em' title="入金金额" type='number' v-model='depositMoney' :placeholder="'单次入金不得低于'+minAmount+'美金'">
            </x-input>
          </group>
          <group class='nbui-cell-group ' label-width='6em'>
            <cell class='cell-right-1px' primary='content' title="支付银行"  is-link @click.native='depositeBankClick' :value='selectBankinfo.Name'></cell>
          </group>
          <div class="nb-form-desc" v-if='isShowRate'>
              当前汇率： $1=¥{{rate}} 
          </div>
          <div class="nb-btn_submit nb-btn_primary" @click='applyDeposit()'>
                  确定
          </div>
        </div>
        <div  class='nb-deposit-bd-con'  v-if='showBankList' >
          <bank-list :dataList='depositbankList'   @selectList = 'selectList'>
          </bank-list>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showChannels">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
        left-text="取消"
        right-text="确定"
        title="选择你的支付通道"
        :show-bottom-border="false"
        @on-click-left="showChannels= false"
        @on-click-right="sureSelectChannel"></popup-header>
        <group gutter="0">
          <radio :options="channelMapComputed" v-model="selectedChannel">
            <template scope="props" slot="each-item">
              <p class='nb-channels-text'>
                <label class='nb-channels-title'>
                  {{channelMapComputed[props.index].key}}  
                </label>
                <span class='nb-channels-desc'>单笔上限金额{{channelMapComputed[props.index].MaxAmount}} 美元</span>
              </p>
            
            </template>
          </radio>
        </group>
      </popup>
    </div>

    <x-dialog v-model='showDialog'>
        <div class='nb-deposit-dialog-wrapper'>
          <flexbox>
            <flexbox-item>
              <x-button @click.native="depositSuccess" type="primary" style='background-color: #40c16b;'>入金成功</x-button>
            </flexbox-item>
            <flexbox-item style='margin-left:15px;'>
              <x-button @click.native="depositFailed" type="warn">入金失败</x-button>
            </flexbox-item>
          </flexbox>
          <p class='nb-deposit-dialog-desc'>
            如入金失败，请<router-link to='/other/support' class='nb-deposit-dialog-desc_link'>联系客服</router-link>
          </p>
        </div> 
      </x-dialog>
  </div>
</template>

<script>
import {Group, XInput, XButton, XHeader, Cell, PopupHeader, Popup, TransferDom, Radio,XDialog,Flexbox,FlexboxItem} from 'vux';
import BankList from 'views/bankCard/bankList';
import {BankDict} from 'configs/configs';
import Api from 'api/api';
import commonApi from 'api/androidApi';
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader,
    Cell,
    PopupHeader, 
    Popup,
    Radio,
    XDialog,
    Flexbox,
    FlexboxItem,
    BankList
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      showBankList:false,
      selectBankinfo:{
        Name: '',
        Id:'',
        Code:'',
      },
      rate: '',
      isShowRate: '',
      minAmount: 100,
      showDialog: false,
      selectedChannel: '',
      currentChannelName: '',
      currentChannelId: '',
      currentDepositId: '',
      showChannels: false,
      depositMoney:'',
      Channelsmap: [],
      bankList: [],
    }
  },
  mounted () {
    Api.getDepositChannels().then(res=>{
      this.Channelsmap = res.Data;
    })
  },
  methods: {
    /**
     * 后退按钮处理
    */
    goback () {
      if ( this.showBankList) {
        this.showBankList = false;
      }else {
        this.goBackRoute();
      }
    },

    /**选择通道 取消按钮触发事件 */
    cancelSelectChannel() {
      this.showChannels = false;
      this.selectedChannel = this.currentChannelName;
    },
     /**选择通道 确定按钮触发事件 */
    sureSelectChannel () {
      this.showChannels = false;
      this.currentChannelName = this.selectedChannel;
      this.depositMoney = '';
      this.selectBankinfo.Name = '';

      for( let item of this.Channelsmap ) {
        if(item.Name == this.selectedChannel){
          this.currentChannelId = item.Id;
          this.rate = item.Rate;
          this.isShowRate = true;
          this.minAmount = item.MinAmount;
          break;
        }
      }
      this.$vux.loading.show({
       text: 'Loading'
      })
      Api.getDepositBanks({ "PaymentChannelId": this.currentChannelId}).then(res=>{
        this.$vux.loading.hide();
        this.bankList = res.Data;   
      }).catch(err => {
        this.$vux.loading.hide();
      })
    },
    depositeBankClick(){
      if(this.currentChannelName == ''){
        this.toast.show('请先选择支付通道');
      }else{
        this.showBankList = true;
      }
    },
    headerArrowClick(){
      this.show = false;
    },
    /**
     * 选择银行列表的子项触发的事件
     * 
    */
    selectList(item){
      this.showBankList = false;
      this.bankList.map( dict => {
        if(dict.BankName.indexOf(item.name) >= 0){
          this.selectBankinfo = {
            Name: dict.BankName,
            Id: dict.Id,
            Code: dict.BankCode
          }   
        }
      })
    },
    applyDeposit(){
      if(this.depositMoney==''){
        this.toast.show( '请填写入金金额');
        return;
      }
      if(this.selectBankName==''){
        this.toast.show('请选择支付银行');
        return;
      }
      var params = {
         PaymentChannelId: this.currentChannelId,
         Amount: this.depositMoney,
         BankId: this.selectBankinfo.Id
      };
      this.$vux.loading.show({
       text: 'Loading'
      })
      Api.getDepositApply(params).then(res=>{
        this.$vux.loading.hide();
        // window.location.href = res.Data.PaymentUrl;
        this.currentDepositId = res.Data.DepositId;
        setTimeout(()=>{
          this.showDialog = true;
        },200);
        commonApi.androidApi.toNewWindow(res.Data.PaymentUrl);
      }).catch(err=>{
        this.$vux.loading.hide();
      })
    },

    depositSuccess(){
        Api.getOrderDetail('deposit', this.currentDepositId).then(res=>{
          if(res.Data.Status == 2) {
            this.$router.push({path: '/capital'});
          }else{
             this.showDialog = false;
          }
        }).catch(err=>{
          this.showDialog = false;
        })
    },
    depositFailed(){
        Api.getOrderDetail('deposit', this.currentDepositId).then(res=>{
          if(res.Data.Status == 2) {
            this.$router.push({path: '/capital'});
          }else{
            this.showDialog = false;
          }
        }).catch(err=>{
          this.showDialog = false;
        })
    }
  },
  computed:{
    leftOptions () {
      return {
        showBack: true,
        preventGoBack: true ,
        backText: ''
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    title () {
      return this.showBankList ? '选择银行' : '入金';
    },
    // headerTransition () {
    //   return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    // },
    /**
     * 
     * 换算后的通道列表集合
    */
    channelMapComputed () {
      this.Channelsmap.reverse();
      return this.Channelsmap.map( (item,index) => {
        console.log('channelItem',item);
          return Object.assign({} , item, { key: item.Name});
        });
    },
    /**
     * 入金银行列表
    */
    depositbankList () {
      return BankDict.filter(dict => {
          for(let item of this.bankList) {
            if (item.BankName.indexOf(dict.name) >= 0) {
              return true;
            }
          }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.nb-desposit{
  top: 0;
  height: 100%;
}
.nb-deposit-bd {
  padding-top: 46PX;
  height: 100%;
}
.nb-deposit-bd-wrapper{
  position: relative;
  height: 100%;
}
.nb-deposit-bd-con{
  position: absolute;
  width:100%;
  height:100%;
  left:0;
  top:0;
  &.main-page {
    padding: 40px 30px 0;
  }
}

.passageWays-group{
  .weui-cells{
    overflow:visible;
  }
}
.passageWays-wrapper{
  color:#000;
  width: 100%;
  .passageWaysList{
    background-color: #fff;
    border:1px solid #ccc;
    border-top:0;
    box-shadow: 0px 4px 8.8px 1.2px rgba(99, 99, 99, 0.35);
    position: absolute;
    width: 100%;
    z-index:999;
    top:53px;
    left:0;
    .passageWaysList-item{
        font-size:24px;
        padding-top:20px;
        padding-bottom:20px;
        padding-left:15px;
        border-bottom:1px solid #ccc;
        small{
          color:#666;
          font-size:20px;
        }
    }
  }
}

.nb-form-desc{
  margin-top:20px;
  color:#666;
  font-size:24px;
  text-align:right;

}

.nb-channels-text {
  display: flex;
  justify-content: flex-start;
  align-items :center;
}
.nb-channels-title {
  color: #000;
  font-size: 32px;
}
.nb-channels-desc {
  color: #999;
  font-size: 28px;
  margin-left: 20px;
}
/*dialog*/
.nb-deposit-dialog-wrapper{
  padding:40px;
}
.nb-deposit-dialog-desc{
  font-size: 32px;
  padding-top: 30px;
  color: #666;
}
.nb-deposit-dialog-desc_link{
  color:#48bed4;
}
</style>

