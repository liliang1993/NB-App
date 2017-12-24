<template>
    <div class='nb-accessOrder-List'>
      <div class='nb-accessOrder-List-hd'>
          <span class='nb-accessOrder-List-hd-left'>{{dateRange}}</span>
          <i class='nb-accessOrder-List-icon-calender' :id="listType+'Calendar'">
          </i>
          <input type="hidden" id='startDate'>
          <input type="hidden" id='endDate'>
      </div>
      <div class='nb-accessOrder-List-bd'>
        <div class='scroll-wrapper'>
          <scroll ref='scroll'
            :pullDownRefresh= "pullDownRefreshObj"
            :pullUpLoad= 'pullUpLoadObj'
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
          >
            <order-list-item 
            v-if='isHaveData'  
            :type='listType' 
            :list = 'orderListComputed'
            @on-item-click = 'onitemClick'
            >
            </order-list-item>
            <null-data v-else></null-data>
          </scroll>
        </div>
      </div>
      
    </div>
    
</template>

<script>
import OrderListItem from 'components/OrderListItem' 
import Scroll from 'components/scroll/scroll'
import NullData from '../noData/nullData'
import OrderListDetail from 'components/OrderListDetail'
import {getCurrentMonthFirst,getCurrentMonthLast} from 'utils/utils'
import Api from 'api/api'
export default {
  components : {
    OrderListItem,
    Scroll,
    OrderListDetail,
    NullData
  },
  props: {
    listType: String,
  },
  data () {
    return {
      pageNum: 0,
      pageSize: 10,
      totalNum: 0,
      showOrderDetail: false,
      detailData: {},
      orderList: [],
      dateRange: '本月',
      startTime: '',
      endTime: '',
      allLoaded: false,
      isHaveData: true,
      pullDownRefreshObj:{
      threshold: 60,
      stop: 30,
      txt: '更新完成'
      }
    }
  },
  methods: {
    add0(m){
      return m<10?'0'+m:m 
    },
    format(time){
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    // var h = time.getHours();
    // var mm = time.getMinutes();
    // var s = time.getSeconds();
    return y+'-'+this.add0(m)+'-'+this.add0(d);
    },
    matchStatus(status){
      if(this.listType == 'deposit'){
        if(status == 2 ){
            return '已入金'
        }else{
            return '入金失败'
        }
      }else if(this.listType == 'withdraw'){
        switch (status) {
          case -1:
              return ' 出金失败'
          case 1: 
              return '已扣款'
          case 2:
          case 3:
              return '已出金'
          default: 
              return '出金失败'
        }
      }
    },
    /**创建日历插件 */
    rebuildCalendar () {
      let instance,self;
      self = this,
      instance = mobiscroll.range('#'+this.listType+'Calendar', {
          theme: 'material',
          lang: 'zh',
          display: 'top',
          controls: ['calendar'],
          defaultValue: [getCurrentMonthFirst(),  getCurrentMonthLast() ],
          startInput: '#startDate',
          endInput: '#endDate',
          dateFormat:'yy-mm-dd',
          onSet(even,inst){
              //点击确定以后的结果
            self.startTime = $('#startDate').val()+' 00:00:00' ;
            self.endTime = $('#endDate').val()+" 23:59:59";
            Api[self.loadListDataMethod]({
              PageIndex:1,
              PageSize: self.pageSize,
              StartTime: self.startTime,
              EndTime: self.endTime
            }).then(res=>{
                self.orderList = res.Data ? res.Data :[] ;
                if(self.orderList.length == 0) {
                self.isHaveData = false;
                self.allLoaded  = true; 
                }else{
                  self.pageNum = res.Pagination.PageIndex;
                  self.pageSize = res.Pagination.PageSize;
                  self.totalNum = res.Pagination.Total;
                  self.isHaveData = true;
                  self.allLoaded = self.pageNum == Math.ceil(self.totalNum/self.pageSize);
                }
                self.dateRange = $('#startDate').val() + ' 至 '+ $('#endDate').val();
                self.$nextTick(() => {
                  self.$refs.scroll.forceUpdate();
                }) 
                console.log('order', self.orderList);
            }).catch(err => {
              self.$nextTick(() => {
                self.$refs.scroll.forceUpdate();
              }) 
            })
          }
      });
    },
    /**点击出入金列表的每一项触发的事件*/
    onitemClick(item){
      console.log('item',item);
      this.$emit('on-item-click',item);
    },
    /**
     * 向上拉刷新触发事件
    */
    onPullingUp() {
      if(this.allLoaded == true) {
          return;
      }
      this.pageNum = this.pageNum + 1;
      Api[this.loadListDataMethod]({
          PageIndex: this.pageNum,
          PageSize: this.pageSize,
          StartTime: this.startTime,
          EndTime: this.endTime
        }).then(res=>{
          this.pageNum = res.Pagination.PageIndex;
          this.pageSize = res.Pagination.PageSize;
          this.totalNum = res.Pagination.Total;
          this.allLoaded = this.pageNum == Math.ceil(this.totalNum/this.pageSize)
          this.orderList = this.orderList.concat(res.Data);
          this.$nextTick(()=> {
              this.$refs.scroll.forceUpdate();
          });
        }).catch(err=>{
          this.$refs.scroll.forceUpdate();
        });
    },
    /**
     * 向下拉刷新触发的事件
     */ 
    onPullingDown(){
      this.pageNum = 1;
      Api[this.loadListDataMethod]({
              PageIndex: this.pageNum,
              PageSize: this.pageSize,
              StartTime: this.startTime ,
              EndTime: this.endTime 
            }).then(res=>{
              // this.allLoaded = res.Pagination.Total == (this.pageNum-1) * this.pageSize + res.Data.length;
              // console.log('1234',this.allLoaded);
              this.orderList =res.Data ? res.Data :[] ;
              if(this.orderList.length == 0) {
                this.isHaveData = false;
                this.allLoaded  = true; 
              }else {
                this.pageNum = res.Pagination.PageIndex;
                this.pageSize = res.Pagination.PageSize;
                this.totalNum = res.Pagination.Total;
                this.isHaveData = true;
                this.allLoaded = this.pageNum == Math.ceil(this.totalNum/this.pageSize);
              }
              this.$nextTick(() => {
                 this.$refs.scroll.forceUpdate();
              })    
            }).catch(err=>{
              this.$refs.scroll.forceUpdate();
            })
    } 
  },
  computed:{
    loadListDataMethod () {
      return this.listType == 'deposit' ? 'getDepositList' : 'getWithdrawList'
    },
    orderListComputed  () {
      let res = [];
      this.orderList.map(item=>{
      let obj =  Object.assign({}, item, {statusName: this.matchStatus(item.Status)}); 
        res.push(obj);
      });
      console.log('withdrawList',res);
      return res;
    },
    pullUpLoadObj(){     
      return this.allLoaded ? false :{
        threshold:0,
        txt:{more:'正在加载', nomore:'已无更多'}
      };     
    }
  },
  mounted() {
    this.rebuildCalendar();
    this.startTime = this.format( getCurrentMonthFirst() ) +' 00:00:00';
    this.endTime = this.format( getCurrentMonthLast() ) + ' 23:59:59';
    this.onPullingDown();
  }
}
</script>

<style lang='less' scoped>
  .nb-accessOrder-List{
    width: 100%;
    height: 100%;
  }
  .nb-accessOrder-List-hd{
      padding: 0 40px;
      position: absolute;
      width: 100%;
      height:76px;
      background-color: #e9e9e9;
      display: flex;
      justify-content: space-between;
      align-items:  center;
  }
  .nb-accessOrder-List-hd-left{
    font-size: 30px;
    color: #333;
  }
  .nb-accessOrder-List-icon-calender{
      display: inline-block;
      width: 36px;
      height: 36px;
      background : url(../../assets/capital/icon-calendar.png) no-repeat center;
      background-size: contain;
  }
  .nb-accessOrder-List-bd{
    padding-top:78px;
    height:100%;
  }
  .scroll-wrapper {
    position:relative;
    height:100%;
  }
</style>

