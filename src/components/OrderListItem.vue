<template>
  <div>
    <group class='nb-orderList-group' v-for='(item,index) in listComputed'>
      <cell :title ='item.statusName' :inline-desc = 'item.CreateTime' @click.native = "onItemClick(item)"  class='vux-tap-active'>
        <div slot='icon' class='nb-orderList-icon-wrapper'>
          <i  class='nb-orderList-icon' :class ='iconClass'>
           </i>
        </div> 
         <p class='nb-orderList-ft'>
           <label class='nb-orderList-ft-value'>{{item.AmountComputed}}</label>
         </p>
      </cell>
    </group> 
  </div> 
</template>

<script>
import {Group,Cell} from 'vux'
export default {
  name: 'orderList',
  components: {
    Group,Cell
  },
  data () {
    return {
      
    }
  },
  props:{
    list: Array,
    type: String
  },
  methods: {
    onItemClick (item) {
      this.$emit('on-item-click', item);
    }
  },
  computed: {
    iconClass() {
      return {
        'nb-orderList-icon-deposit': this.type == 'deposit',
        'nb-orderList-icon-withdraw': this.type == 'withdraw'
      }
    },
    listComputed () {
      return this.list.map ( item => {
        console.log ('item',item);
        let obj;
        if(this.type == 'deposit') {
          obj = {
            CreateTime: item.CreateDate,
            AmountComputed : '+$'+item.Amount
          }
          return Object.assign({}, item ,obj);
        } else {
          obj = {
            AmountComputed : '-$'+item.Amount
          }
          return Object.assign({}, item ,obj);
        }
      })
    }
  }
}
</script>

<style lang ='less'>
  .nb-orderList-group{
    .weui-cells{
      margin-top:0;
    }
    .vux-label{
      font-size: 30px;
      color: #333;
      margin-bottom: 10px;
    }
    .vux-label-desc{
      display: block;
      font-size: 24px;
      color: #999;
    }
  }
  .nb-orderList-icon-wrapper{
    display: flex;
    align-items: center;
    margin-right: 18px;
    .nb-orderList-icon {
      display: inline-block;
      height: 70px;
      width: 70px;
      background-position: center center;
      background-size: contain;
    } 
  }
  .nb-orderList-ft{
    text-align: center;
  }
  .nb-orderList-ft-value{
    display: block;
    color: #333333;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .nb-orderList-ft-desc{
    display: block;
    font-size: 24px;
    color: #13b31e;
  }
  .nb-orderList-icon{
    display: inline-block;
    height: 70px;
    width: 70px;
    background-position:center center;
    background-size:contain;
  }
  .nb-orderList-icon-deposit{
    background-image: url('../assets/capital/icon-depositList.png');
  }
  .nb-orderList-icon-withdraw{
    background-image: url('../assets/capital/icon-withdrawList.png');
  }
</style>


