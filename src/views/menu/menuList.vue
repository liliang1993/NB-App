<template>
  <div style='position:relative;top:0px;height:100%;'>
    <x-header slot="header"
      style="width:100%;position:absolute;left:0;top:0;z-index:100;"
      class='vux-1px-b'
      @on-click-back ='goBack()'
      :left-options="leftOptions"
      :right-options="rightOptions"
    >
          <div class="overwrite-title-tab" slot="overwrite-title">
            <button-tab v-model='tabIndex'>
              <button-tab-item>
                 财经日历                      
              </button-tab-item>
              <button-tab-item 
                v-for='(item, index) in articleMenuList'
                :key='index'
              > 
                {{item.name}}
              </button-tab-item>
             
            </button-tab>
          </div>
        </x-header>  
      <swiper  :options="swiperOption" class="swiper-box" ref="mySwiper">
        <swiper-slide class="swiper-item"> <finance-news v-if='activeIndex === 0 || isUpdated[0]'></finance-news></swiper-slide>
        <swiper-slide 
        class="swiper-item" 
        v-for='(item,index) in articleMenuList'
        :key='index'
        >
          <article-list :menuName = 'item.name' v-if='activeIndex == index + 1 || isUpdated[index + 1]' @onItemClick = 'onItemClick' >
          </article-list>
        </swiper-slide>
      </swiper>
      <article-details 
      v-if='showArticleDetail'
      :id = 'articleId'
      :origin = 'articleOrigin'
      @onClickGoBack = 'onClickGoBack'>
      </article-details>
  </div>
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  XHeader
} from 'vux'
import {MenuList} from 'configs/configs'
export default {
  components: {
  ButtonTab,
  ButtonTabItem,
  XHeader,
  financeNews:resolve => {require(['components/FinanceNews'], resolve)},
  ArticleList:resolve => {require(['components/Articles'], resolve)},
  ArticleDetails:resolve => {require(['components/ArticleDetails'], resolve)},
  },
  data () {
    return {
      /** 是否显示文章详情 */
      showArticleDetail:false,
      articleId: '',
      articleOrigin: '',

      articleMenuList:MenuList,
      activeIndex: '',
      isUpdated:[false,false,false],
      tabIndex: undefined,
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
  watch:{
    tabIndex (val) {
      this.swiper.activeIndex = val;
      this.activeIndex = val;
    },
    activeIndex(val) {
      if( this.isUpdated[val] != true) {
        this.isUpdated[val] = true;
      }  
    }
  },
  methods: {
    goBack () {
      
      // alert('被点击了'+this.$route.path);
      // this.$router.go(-1);
      this.goBackRoute();
      // alert('被点击了2'+this.$route.path);
    },
    onClickGoBack () {
      this.showArticleDetail = false;
    },
    onItemClick (item) {
      this.showArticleDetail = true;
      this.articleId = item.id;
      this.articleOrigin = item.origin;
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
    this.$nextTick(()=>{
      this.tabIndex = parseInt(this.$route.query.index);

      this.swiper.activeIndex = this.tabIndex;
      this.activeIndex = this.swiper.activeIndex;
    })
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
<style lang='less' scoped>
.swiper-box {
    width: 100%;
    height: 100%;
    padding-top:46PX;
    margin: 0 auto;
  }
  .swiper-item {
    height: 100%;
  }
</style>

