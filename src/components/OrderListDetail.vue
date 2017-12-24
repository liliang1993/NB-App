<template>
  <div>
    <x-header slot="header"
    style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    class='vux-1px-b'
    :left-options="leftOptions"
    :right-options="rightOptions"
    :title="title"
    @on-click-back = 'onClickBack'
    >

  </x-header>
  <div class='nb-orderList-detail'>
    <div class='nb-orderList-detail-header'>
      <div class='nb-orderList-icon-wrapper'>
        <i class='nb-orderList-icon' :class ='iconClass'></i>
      </div>
      <p class='nb-orderList-detail-header-title'>
        {{data.statusName}}
      </p >
      <span class='nb-orderList-detail-header-value' :style='valueStyle'>
        ${{data.Amount}}  
      </span>  
    </div>
    <div class='nb-orderList-detail-form'>
      <ul class='nb-orderList-detail-form-con'>
        <li class='nb-orderList-detail-form-item'>
          <label class='nb-orderList-detail-form-title'>{{ this.type == 'deposit' ? '转入说明' : '转出说明'}}</label>
          <p class='nb-orderList-detail-form-value'>{{instruction}}</p>
        </li>
        <li class='nb-orderList-detail-form-item'>
          <label class='nb-orderList-detail-form-title'>转入账户</label>
          <p class='nb-orderList-detail-form-value'>{{data.MT4Account}}</p>
        </li>
         <li class='nb-orderList-detail-form-item'>
          <label class='nb-orderList-detail-form-title'>创建时间</label>
          <p class='nb-orderList-detail-form-value'>{{CreateTime}}</p>
        </li>
        <li class='nb-orderList-detail-form-item' v-if=' type =="deposit" '>
          <label class='nb-orderList-detail-form-title'>汇率</label>
          <p class='nb-orderList-detail-form-value'>{{data.ExchangeRate}}</p>
        </li>
         <li class='nb-orderList-detail-form-item'>
          <label class='nb-orderList-detail-form-title'>人民币</label>
          <p class='nb-orderList-detail-form-value'>¥{{data.RealPay}}</p>
        </li>
      </ul>
    </div>
    <div class='nb-orderList-detail-progress'>
      <div class='nb-step-item  nb-step-item-first'>
        <div class='nb-step-item-tail'></div>
        <div class='nb-stp-item-head'>
          <i class='nb-step-icon nb-step-icon-first'>
          </i>
        </div>
        <div class='nb-stp-item-main'> 
            <p class='nb-stp-item-title'>{{firstStepTitle}}</p>
            <span class='nb-stp-item-desc'>{{ data.CreateTime }}</span>
        </div>
      </div>
      <div v-if='isShowSecondStep' class='nb-step-item nb-step-item-middle'>
        <div class='nb-step-item-tail'></div>
        <div class='nb-stp-item-head'>
          <i class='nb-step-icon nb-step-icon-second'>

          </i>
        </div>
        <div class='nb-stp-item-main'> 
            <p class='nb-stp-item-title' >{{secondStepTitle}}</p>
        </div>
      </div>
      <div class='nb-step-item nb-step-item-last'>
        <div class='nb-step-item-tail' :style='progressStyle'></div>
        <div class='nb-stp-item-head'  :style='progressStyle'>
          <i class='nb-step-icon' :class='lastStepIcon' >

          </i>
        </div>
        <div class='nb-stp-item-main'> 
            <p class='nb-stp-item-title' >{{lastStepTitle}}</p>
            <span class='nb-stp-item-desc' v-if ='isFinished' >{{ data.PayTime }}</span>
        </div>
      </div>
    </div>
  </div> 
  </div>
   
</template>

<script>
import {XHeader} from 'vux'
export default {
  name:'OrderListDetail',
  components: {
    XHeader
  },
  props: {
    type: {
      type: String,
      default: 'withdraw'
    },
    data: Object
  },
  data () {
    return {
      isShowSecondStep : true,
      isFinished : false
    }
  },
  methods: {
    onClickBack () {
      this.$emit('onClickBack');
    },
    lastStepTitleMatch (type) {
      if (type == 'deposit') {
        this.isShowSecondStep = false;
        if(this.data.Status == 2) {
          this.isFinished= true;
          return '入金成功'
        }else {
          this.isFinished= true;
          return '入金失败'
        }
      }else {
         if (this.data.Status == 2 || this.data.Status == 3 ) {
          this.isFinished= true;
          return '出金成功'
         }else if( this.data.Status == -1 ){
          this.isFinished= true;
          return '出金失败'
         }else if ( this.data.Status == 1 ) {
          this.isFinished= false;
          return '出金成功'
         } 
      }
    }
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
    iconClass() {
      return {
        'nb-orderList-icon-deposit': this.type == 'deposit',
        'nb-orderList-icon-withdraw': this.type == 'withdraw'
      }
    },
    title () {
      return this.type == 'deposit' ? '入金明细' : '出金明细' 
    },
    valueStyle() {
      return {
        color: this.type == 'deposit' ? '#f56262' : '#4cae2a'
      }
    },
    instruction () {
      if ( this.type == 'withdraw'){
        if(this.data.BankAccount){
          let account = this.data.BankAccount;
          console.log('213',account,length);
          let length = account.length;
          return this.data.BankName +'(****'+ account.substring(length-5,length-1) + ')';
        }
      } else if( this.type == 'deposit' ) {
        return '转入到账户';
      }
    },
    CreateTime () {
        if ( this.type == 'deposit' ) {
          return  this.data.CreateDate;
        }else {
          return this.data.CreateTime;
        }
    },
    progressStyle () {
      return {
        backgroundColor : this.isFinished ? '#48bed4' : '#c7c7cc' 
      }
    },
    firstStepTitle () {
      return this.type == 'deposit' ? '入金申请已提交' : '已扣款'
    },
    secondStepTitle () {
      return this.type == 'withdraw' ? '出金待审核（2-3个工作日)':'';
    },
    lastStepTitle() {
      return this.lastStepTitleMatch(this.type);
    },
    lastStepIcon() {
      if(this.type == 'deposit'){
        return this.data.Status == 2 ?  'nb-step-icon-success' : 'nb-step-icon-failed'
      }else {
        return this.data.Status !== -1 ? 'nb-step-icon-success' : 'nb-step-icon-failed' 
      }
    }
  }
}
</script>

<style lang='less'>
  .nb-orderList-detail {
    padding: 0 30px;
    padding-top: 46PX;
    height: 100%;
  }
  .nb-orderList-detail-header{
    display: flex;
    align-items: center;
    font-size: 36px;
    padding-top:30px;
  }
  .nb-orderList-detail-header-title{
    flex:1;
    color: #333;
  }
  .nb-orderList-detail-form{
    border: 1PX solid #ccc;
    margin-top: 40px;
  }
  .nb-orderList-detail-form li {
    padding-left: 30px;
    font-size: 30px;
    display: flex;
    &+li {
      border-top: 1PX  solid #ccc;
    }
  }
  .nb-orderList-detail-form-title{
      width: 6em;
      padding-top: 25px;
      padding-bottom: 25px;
      border-right: 1PX solid #ccc;
      color:#333;
  }
  .nb-orderList-detail-form-value{
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 30px;
    flex:1;
    background-color: #fafafa;
    color:#999;
  }
  .nb-orderList-detail-progress {
    margin-top: 70px;
  }
  .nb-step-item {
     position: relative;
     display: flex;
     align-items: center;
  }
  .nb-step-item-first{
     padding-bottom: 40px;  
  }
  .nb-step-item-middle{
      padding-top: 40px;
     padding-bottom: 40px;  
  }
  .nb-step-item-last{
      padding-top: 40px;
  }
  .nb-step-item-tail{
    width: 5px;
    height:100%;
    background-color: #48bed4;
    position: absolute;
    left:30px;
    top:0;
    padding: 0 0;
  }
  .nb-stp-item-head{
    position: relative;
    background-color: #48bed4;
    margin-right: 20px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nb-step-icon { 
    display: inline-block;
    width: 40px;
    height: 35px;
    background-position:center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .nb-step-icon-first{
    background-image: url('../assets/capital/icon-first-step.png')
  }
  .nb-step-icon-failed{
    background-image: url('../assets/capital/icon-step-failed.png')
  }
  .nb-step-icon-success{
    background-image: url('../assets/capital/icon-step-success.png')
  }
  .nb-step-icon-second{
    background-image: url('../assets/capital/icon-second-step.png')
  }
  .nb-stp-item-main {
     position: relative;
  }
  .nb-stp-item-title{
    font-size:30px;
    color: #000;
    margin-bottom:5px;
  }
  .nb-stp-item-desc{
    display: block;
    font-size:24px;
    color: #999;
  }
</style>
