<template>
  <div style='position:relative;top:0px;height:100%;'>
    <x-header slot="header"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
      class='vux-1px-b'
      :left-options="leftOptions"
      :right-options="rightOptions"
      @on-click-back = 'goback'
    >
      <div  class="overwrite-title-tab" slot="overwrite-title">
        <button-tab v-if='!showOrderDetail' v-model='tabIndex'>
          <button-tab-item  >
            入金                      
          </button-tab-item>
          <button-tab-item>
            出金                      
          </button-tab-item>
        </button-tab>
        <span  v-if='showOrderDetail' style='display:block;padding:4px 0;'>
          出金明细
        </span>
      </div>
    </x-header>  
    <div class='nb-orderListPage-wrapper'>
      <div class='nb-orderListPage-con'>
        <swiper :options="swiperOption" class="swiper-box" ref="mySwiper">
        <swiper-slide class="swiper-item"><order-list listType = 'deposit' @on-item-click ="onItemClick($event,'deposit')" ></order-list></swiper-slide>
        <swiper-slide class="swiper-item"><order-list listType = 'withdraw'  @on-item-click ="onItemClick($event,'withdraw')"></order-list></swiper-slide>
        </swiper> 
      </div>
      <order-list-detail
        style='position:absolute;top:0;z-index:1000;width:100%; height:100%;background-color:#fff;'
        v-if='showOrderDetail'
        @onClickBack = 'showOrderDetail = false'
        :type = 'type'
        :data = 'detailData'  
        >
        </order-list-detail>  
    </div>
    
    
  </div>  
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  XHeader
} from 'vux'
import OrderList from './orderList'
import OrderListDetail from 'components/OrderListDetail'
import Api from 'api/api'
export default {
  name: 'paymentPage',
  components: {
    ButtonTab,
    ButtonTabItem,
    XHeader,
    OrderList,
    OrderListDetail
  },
  data () {
    return {
      tabIndex: 0,
      type: '',
      detailData: {},
      showOrderDetail: false,
      swiperOption: {
        pagination: '.swiper-pagination',
        direction: 'horizontal',
        slidesPerView: 1,
        paginationClickable: true,
        mousewheelControl: true,
        touchAngle:25,
        onSlideChangeEnd:(swiper)=>{
            this.tabIndex = swiper.activeIndex;
        }
      }
    }
  },
  methods: {
    goback () {
      if (this.showOrderDetail == true) {
        this.showOrderDetail = false;
      }else {
         this.goBackRoute();
      }
    },
    onItemClick (item, type) {
      Api.getOrderDetail(type,item.Id).then(res=>{
        this.showOrderDetail = true;
        this.type = type;
        this.detailData = res.Data;
        this.detailData.statusName = item.statusName;
      })
    } 
  },
  mounted () {

  },
  watch:{
    tabIndex (val) {
      this.swiper.activeIndex = val;
      this.activeIndex = val;
    }
  },
  computed:{
    leftOptions () {
      return {
        showBack: true,
        preventGoBack: true,
        backText: ''
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    swiper() {
      return this.$refs.mySwiper.swiper
    }  
  }
}
</script>

<style>
  .nb-orderListPage-wrapper {
    padding-top: 46PX;
    height: 100%;
  }
  .nb-orderListPage-con{
    position:relative;
     width: 100%;
     height: 100%;
  }
  .swiper-box {
    width: 100%;
    height: 100%;
  }
  .swiper-item {
    height: 100%;
  }
</style>
