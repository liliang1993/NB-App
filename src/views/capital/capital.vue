<template>
  <div>
    <div class='nb-capital'>
      <ul>
        <li>
            <div class="desc">
               <!--  2000.<i>00</i> -->
               <!-- {{'20000' | formatString}} -->
               ${{balance | formatData}}
            </div>
            <p class='title'>账户余额</p>
        </li>
        <li>
            <div class="desc">
                <!-- 5000.<i>00</i> -->
                <!-- $500.00K -->
                ${{credit | formatData}}
            </div>
            <p class='title'>信用金</p>
        </li>
      </ul>
    </div>
    <div class="nb-grids">
        <div class='nb-grid'>
            <p class='nb-grid-title'>可用保证金</p>
            <span class='nb-grid-text'>${{freeMargin | formatData}}</span>
        </div>
        <div class='nb-grid'>
            <p class='nb-grid-title'>已用保证金</p>
            <span class='nb-grid-text'>${{margin | formatData}}</span>
        </div>
        <div class='nb-grid'>
            <p class='nb-grid-title'>保证金比例</p>
            <span class='nb-grid-text c-4abcd2'>{{margin_level | formatData}}%</span>
        </div>
    </div>
     <group class='cap-cell-box nbui-cell-group'>
      <cell title="净值">${{equity | formatData}}
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-equity'>
          </i>
        </div> 
      </cell>
     <cell title="浮动盈亏">${{profit | formatData}}
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-profit'>
          </i>
        </div> 
     </cell>
      <cell title="我的投资"  is-link  @click.native= 'routeToOrder'>
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-myInvest'>
          </i>
        </div> 
      </cell>
      <cell title="出入金明细"  is-link link='/capital/orderList'>
        <div slot='icon' class='cell-icon-wrapper flex items-center'>
          <i  class='nb-cell-icon cell-icon-paymentList'>
          </i>
        </div>   
      </cell>
    </group>
      <flexbox justify='space-between' style='padding:0 20px;'>
        <flexbox-item>
          <x-button plain style='border-color:#48bed4; color:#48bed4;'  @click.native='depositHandle'>入金</x-button>
        </flexbox-item> 
        <flexbox-item style='margin-left: 20px;'>
          <x-button type='primary'  @click.native='withdrawHandle'>出金</x-button>
        </flexbox-item>  
      </flexbox> 
      <!-- <div>
        <div class="nb-btn-box">
            <div  class='nb-btn nb-btn__normal'> 入金</div>
            <div  class='nb-btn nb-btn__primary' @click='withdrawHandle'>出金</div>
        </div>
      </div> -->
  </div>
</template>

<script>
import { Group,Grid, GridItem, Cell,XButton,XHeader,Flexbox,FlexboxItem} from 'vux'
import commonApi from'api/androidApi'
import {mapState} from 'vuex'
import {formatString} from 'utils/utils'
// window.getRoute
export default {
  components: {
    Group,Grid, GridItem,Cell,XButton,XHeader,Flexbox,FlexboxItem
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
    }
  },
  filters:{
    formatData(value){
      return formatString(value, 2, 2);
    }
  },
  methods:{
    /**
     * 跳转到交易界面
    */
    routeToOrder(){
        commonApi.androidApi.jumpToOrder();
    },
  /**
   *  点击入金按钮处理事件 
  */
    depositHandle () {
      if(this.$store.state.user.userInfo.IsUploadIdCard == false){
        commonApi.androidApi.showDialog({
          msg: "您还没有完成实名认证，请先完成实名认证",
          leftButton: "返回",
          rightButton: '绑定',
          leftEvent: "",
          rightEvent: "changeRoute('/account/certification')"
        });
        return;
      }
      this.$router.push({
          path: '/capital/depositApply'
      })
    },

  /**
   *  点击出金按钮处理事件 
  */  
    withdrawHandle () { 
      if(this.$store.state.user.userInfo.BankAccount == ''){
        commonApi.androidApi.showDialog({
          msg: "您还没有完成绑定银行卡，前去绑定",
          leftButton: "返回",
          rightButton: '绑定',
          leftEvent: "",
          rightEvent: "changeRoute('/account/bindbank')"
        });
        return;
      }
      this.$router.push({
          path: '/capital/withdrawApply'
      })
    }
  },
  
  computed:{
    /**
     * balance:余额
     * credit:  资金
     * freeMargin： 可用保证金
     * margin：已用保证金
     * margin_level: 保证金比例
     * equity: 净值
     * profit: 浮动盈亏
     */
    ...mapState({
      balance: state => state.capital.funds.balance,
      credit: state => state.capital.funds.credit,
      freeMargin: state => state.capital.floatData.freeMargin,
      margin: state => state.capital.funds.margin,
      margin_level: state => capital.floatData.margin_level,
      equity: state => state.capital.floatData.equity,
      profit: state => state.capital.floatData.profit, 
    }),
    margin_level(){
      if (this.margin == 0) {
        return 0;
      } else {
        return (this.equity / this.margin * 100).toFixed(2);
      }
    }
  }
}
</script>

<style lang='less'>

/*顶部banner*/
.nb-capital{
    background: url('../../assets/cap-bg.png') no-repeat center;
    background-size:cover;
    ul{

        display:flex;
        justify-content:space-around;
        align-items: center;
    }
    li{
      height: 190px;
      text-align:center;
      display:flex;
      justify-content:center;
      flex-direction:column;
      .title{
          color:#fff;
          font-size:32px;
        }
      .desc{
          font-size:48px;
          vertical-align:middle;
          color:#f9ff9f;
          margin-bottom:20px;
          i{
              font-size:24px;
          }
        }
    }
}
/*第二栏*/
.nb-grids{
    padding:26px 0;
    overflow: hidden;
}
.nb-grid{
  position: relative;
    float:left;
    width:33.33333333333%;
    padding:16px 0;
     text-align: center;
     &:before {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 1px solid #ccc;
    color: #D9D9D9;
    transform-origin: 100% 0;
    transform: scaleX(0.5);
  }
}
.nb-grid-title{
    text-align: center;
    font-size: 32px;
    margin-bottom:22px;
}
.nb-grid-text{
  font-size: 28px;
  color:#666;
  vertical-align: top;
}
.c-4abcd2{
    color:  #4abcd2
}
.cap-cell-box{
  margin-bottom:54px;
  .weui-cells{
      margin-top:0px;
  }
}
.nb-btn-box{
    padding:0 20px;
    display:flex;
    justify-content:space-between;
}
.nb-btn{
    border:1PX solid #48bed4;
    font-size:32px;
    width:270px;
    height:87px;
    line-height:87px;
    text-align:center;
}
.nb-btn__normal{
        color:#48bed4;
    }
.nb-btn__primary{
  float:right;
  background-color: #48bed4 ;
    color:#fff;
}

.cell-icon-equity{
  background-image:url(../../assets/icon-equity.png);
}
.cell-icon-profit{
  background-image:url(../../assets/icon-profit.png);
}
.cell-icon-myInvest{
  background-image:url(../../assets/icon-myInvest.png);
}
.cell-icon-paymentList{
  background-image:url(../../assets/icon-paymentList.png);
}
</style>
