<template>
  <div  class='nb-bankList'>
    <scroll ref='scroll'
      :pullDownRefresh='false'
      :pullUpLoad="false"
    >
      <div class='bankList-wrap'>
          <ul class='bankList-items'>
              <li class='bankList-item vux-tap-active' v-for='(item,index) in dataListComputed' >
                <div class='bankList-item-header flex justify-between items-center vux-tap-active' @click='selectList(item)'>
                  <div class='flex items-center'>
                    <i class='bankList-icon' :style="{backgroundImage: 'url('+item.logo+')'}"></i>
                    <span class='bankList-bankName'>{{item.name}}</span>
                  </div>
                  <!-- <div class='nb-btn_mini nb-btn_primary' @click='isShowDrop(item)'>查看限额</div> -->
                </div>
                <!-- <transition name="drop">
                  <div  class='bankList-item-dropdown'>
                      <table v-if="item.show" class='bankList-item-dropdown__table'  cellspacing="0" >
                        <colgroup>
                              <col width=10%></col>
                              <col width=20%></col>
                              <col width=15%></col>
                              <col width=15%></col>
                              <col width=12%></col>
                        </colgroup>
                        <thead>
                          <tr>
                            <th rowspan='2'>卡种</th>
                            <th rowspan='2'>支付方式</th>
                            <th colspan="2">支付限额</th>
                            <th rowspan="2">客服电话</th>
                          </tr>
                          <tr>
                            <th>每笔限额</th>
                            <th>每日限额</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td rowspan='3'>借记卡</td>
                            <td>手机动态密码版</td>
                            <td>1万</td>
                            <td>1万</td>
                            <td rowspan='3'>95580</td>
                          </tr>
                          <tr>
                            <td>电子令牌</td>
                            <td>20万</td>
                            <td>20万</td>
                          </tr>
                          <tr>
                            <td>USB-KEY</td>
                            <td>100万</td>
                            <td>100万</td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
                </transition> -->
              </li>
          </ul>
      </div>
    </scroll>
  </div>
</template>
<style lang='less'>
  .nb-bankList {
    background-color:#fff;
    position: relative;
    height:100%;
    width: 100%;
  }
  .bankList-wrap{
    height:100%;
  }
  .bankList-items{
  
  }
  .bankList-item{

  }
  .bankList-item-header{
      padding:15px;
      border-bottom:1px solid #ccc;
      .bankList-icon{
        display:inline-block;
        width: 53px;
        height:53px;
        background-size:cover;
      }
      .bankList-bankName{
        padding-left:15px;
        font-size:32px;
        color:#333;
      }
  }
  .bankList-item-dropdown{
    background-color: #f5f5f5;
  }
  .bankList-item-dropdown__table{
      width:100%;
      text-align:center;
      tr{
        font-size:24px;
        th{
          font-weight:normal;
          border:1px solid #ccc;
          border-top:0;
          color:#333;
        }
        td{
           border:1px solid #ccc;
           padding-top:5px;
           padding-bottom:5px;
        }
      }
  }
  .drop-enter-active,.drop-leave-active {
    transition: all 2s ease;
  }
  .drop-enter,.drop-leave-active {
     height:0px;
  }
  .bankList-item-dropdown{
    height:100%;
  }
</style>

<script>
import {XHeader} from 'vux'
import Scroll from 'components/scroll/scroll'
import {BankDict} from 'configs/configs'

export default {
  name:'bankList',
  components: {
    Scroll
  },
  props:{
    /**
     * 银行卡信息参数
     * name：银行名称
     * logo： 银行后缀 用于图片地址
     */
    dataList:{
      type:Array,
      default: []
    }
  },
  filters:{
    bankCardEncrypt(item){
      return item.replace(/^(\d{4})\d+(\d{4})$/, "$1****$2")
    }
  },
  data () {
    return {
     
    }
  },
  watch: {
    dataList: {
      handler(newValue, oldValue) {
        console.log('888');
        this.rebuildScroll();
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate();
        })
      },
      deep: true
    }
  },
  methods: {
     rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll&&this.$refs.scroll.initScroll();
        })
    },
    selectList(item){
      this.$emit('selectList',item);
    },
    logoUrlMatch (name) {
      for ( let item of BankDict) {
        if(name.indexOf(item.name) > 0) {
            return item.logo
        }
      }
      return 'ABC'
    } 
    // isShowDrop(item){
    //   console.log('item',item);
    //   item.show = !item.show;
    // }
  },
  computed:{
    dataListComputed(){
      if(this.dataList){
        console.log('123',this.dataList);
        return  this.dataList.map(item =>  {
          return {
            name: item.name,
            logo: require('../../assets/bankLogo/bankLogo-'+item.logo+'.png') 
          }
        })
      }else{
        return []
      }    
    }
  },
  mounted(){
    this.rebuildScroll();
    console.log('bankList',this.bankInfoList);
  }
}
</script>

