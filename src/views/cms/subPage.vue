<template>
  <div>
      <x-header slot="header"
                      class='view-header'
                      :left-options="leftOptions"
                      :right-options="rightOptions"
                      title="slot:overwrite-title"
                      :transition="headerTransition"
                     >
          <div class="nb-header-left" slot='overwrite-left' @click='$router.push({path:"/home"})'>
              <i  class='header-back-icon'>
              </i>
          </div>
          <div class="overwrite-title-demo" slot="overwrite-title">
            <button-tab v-model='tabIndex'>
              <button-tab-item
              v-for='(item,index) in MenuList'
              @on-item-click ='headerTabItemClick(index)'
              :selected='currentTab==item.Name'
              >{{item.Name}}</button-tab-item>
            </button-tab>
          </div>
      </x-header>
      <swiper :options="swiperOption" class="swiper-box" ref="mySwiper">
        <swiper-slide class="swiper-item"><finance-news></finance-news></swiper-slide>
        <swiper-slide class="swiper-item"><article-list :menuName = 'MenuList[1].Name'></article-list></swiper-slide>
        <swiper-slide class="swiper-item"><article-list :menuName = 'MenuList[2].Name'></article-list></swiper-slide>
      </swiper>
  </div>
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  XHeader
  // Swiper,
  // SwiperItem
} from 'vux'
import {MenuList} from '../../configs/configs'
export default {
  components: {
  ButtonTab,
  ButtonTabItem,
  XHeader,
  financeNews:resolve => {require(['../../components/FinanceNews'], resolve)},
  // Swiper,
  // SwiperItem,
  ArticleList:resolve => {require(['../../components/Articles'], resolve)}
  },
  methods: {
    headerTabItemClick(index){
        this.currentTab == MenuList[index].Name;
        this.swiper.slideTo(index, 1, true);
    },
    getArticleList(pageIndex,menuId){
      console.log('api',Api);
    return  Api.getArticleList({
              PageIndex: pageIndex,
              PageSize: 20,
              MenuId: menuId
            })
    }  
  },
  created(){
      this.currentTab = this.$route.params.name;
     MenuList.forEach((item, index)=> {
        if(this.currentTab == item.name){
          this.tabIndex = index;
        }
     })
      this.$nextTick(()=>{
        this.swiper.slideTo(this.tabIndex, 1, true);
        console.log('route',this.currentTab);
      })

  },
  computed:{
    leftOptions () {
      return {
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
    swiper() {
        return this.$refs.mySwiper.swiper
      }
  },
  data () {
    return {
      MenuList:MenuList,
      currentTab:'',
      tabIndex:0,
      sliderZIndex:0,
      swiperOption: {
          pagination: '.swiper-pagination',
          direction: 'horizontal',
          slidesPerView: 1,
          paginationClickable: true,
          mousewheelControl: true,
          onSlideChangeEnd:(swiper)=>{
              this.tabIndex = swiper.activeIndex;
          }
        }
    }
  }
}
</script>
<style lang='less' scoped>
.swiper-box {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .swiper-item {
    height: 100%;
  }
</style>

