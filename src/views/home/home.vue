<template>
  <!-- <div class='nb-home'>
    <scroll ref="scroll"
                :pullDownRefresh='pullDownRefreshObj'
                :pullUpLoad="pullUpLoadObj"
                :data = 'articleList'
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp"
              >
          <div class='nb-home-content'>
            <swiper :options="swiperOption" class="swiper-box">
              <swiper-slide v-for='(item,index) in bannerImageList' :key='index' class="swiper-item"><img :src="item.url"  alt=""></swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="nb-grids">
              <div class='nb-grid flex flex-column'>
                  <em class='home-grid-title'>{{symbol.firstSymbol.name}}</em>
                  <i class='home-grid-subtit'>{{symbol.firstSymbol.cName}}</i>
                  <span class='home-grid-text' :style="{color:symbol.firstSymbol.bgc}">{{symbol.firstSymbol.price}}</span>
              </div>
              <div class='nb-grid flex flex-column'>
                    <em class='home-grid-title'>{{symbol.secondSymbol.name}}</em>
                  <i class='home-grid-subtit'> {{symbol.secondSymbol.cName}}</i>
                  <span class='home-grid-text' :style="{color:symbol.secondSymbol.bgc}">{{symbol.secondSymbol.price}}</span>
              </div>
              <div class='nb-grid flex flex-column' @click = 'routeToTrade'>
                  <div  class='home-grid__link'>
                        <span class='home-grid-title home-grid__detail'>查看全部
                        <i></i>
                        </span>
                      <span class='home-grid-subtit'>+MORE</span>
                  </div>
              </div>
            </div>
            <div class='nb-menu-con'>
                  <div>
                    <div @click="$router.push({path:'/menu/menuList', query:{index: 0}})" class="nb-menu-box flex justify-center" style="background-color:#47bed4">
                        <div class="nb-menu-box__hd">
                              <img src="../../assets/global/home-calendar.png"  alt="">
                        </div>
                        <div class="nb-menu-box__bd">
                            <h4 class="nb-menu-box__title">财经日历</h4>
                            <p class="nb-menu-box__desc">Economic Calendar</p>
                        </div> 
                    </div>
                  </div>
                  <div v-for='(item,index) in articleMenuList' :key='index'>
                      <div @click="$router.push({path:'/menu/menuList', query:{index: (index+1) }})" class="nb-menu-box flex justify-center" :style="{backgroundColor:item.bgColor}">
                        <div class="nb-menu-box__hd">
                              <img :src="item.img"  alt="">
                        </div>
                        <div class="nb-menu-box__bd">
                            <h4 class="nb-menu-box__title">{{item.name}}</h4>
                            <p class="nb-menu-box__desc">{{item.engName}}</p>
                        </div>
                      </div>
                  </div>
                  <div>
                    <div @click='$router.push({path:"/other/support"})' class="nb-menu-box flex justify-center" style="backgroundColor:#4ba9ff">
                          <div class="nb-menu-box__hd">
                                <img src="../../assets/global/home-notice.png"  alt="">
                          </div>
                          <div class="nb-menu-box__bd">
                              <h4 class="nb-menu-box__title">客服咨询</h4>
                              <p class="nb-menu-box__desc">consulting service</p>
                          </div>
                    </div>
                  </div>
                </div>
            <div class="nb-line"></div>
              <div class="nb-news">
                  <nb-article-Panel :dataList = 'dataListComputed' @itemClick = 'articlesItemClick'></nb-article-Panel>
              </div>           
        </div>
    </scroll>
    <article-details
      v-if = 'showArticleDetails'
      :id = 'articleId'
      :origin = 'articleOrigin'
      @onClickGoBack = 'onClickGoBack'
    >
    </article-details>
  </div> -->
  <div>
    <!-- <n-button type='primary' :showLoading ='true' link='/capital'>
        a
    </n-button> -->
    <group>
       <cell title='我的' inlineDesc='好的'>
         123
       </cell>
        <cell  title='我的'>
         123
       </cell>
        <cell  title='我的'>
         123
       </cell>
        <cell  title='我的'>
         123
       </cell>
       <n-switch title='开关'>
         123
       </n-switch>
       <n-input title='input' placeholder='我的名字'>
          
       </n-input>
    </group>
    <button-tab style='margin-top:30px;'>
      <button-tab-item>
        adb
      </button-tab-item>
      <button-tab-item selected>
        adc
      </button-tab-item>
      <button-tab-item>
        add
      </button-tab-item>  
    </button-tab>
    <n-header>
      
    </n-header>
  </div>
</template>

<script>
// import {Group,XInput,Grid,GridItem} from 'vux'
import NButton from 'components/button'
import Cell from 'components/cell'
import Group from 'components/group'
import NSwitch from 'components/switch'
import NInput from 'components/input'
import ButtonTab from 'components/button-tab/button-tab'
import ButtonTabItem from 'components/button-tab/button-tab-item'
import NHeader from 'components/header'

import Api from 'api/api'
import {deepClone} from 'utils/utils.js'
import {MenuList,BannerImageList} from 'configs/configs'
import commonApi from'api/androidApi'
import Scroll from 'components/scroll/scroll.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import NbArticlePanel from 'base/articlePanel'
import ArticleHandle from 'mixins/articleHandle'
import {mapState} from 'vuex'
const PAGESIZE = 10;
export default {
    components: {
      // Group,
      // XInput,
      // Grid,
      // GridItem,
      // Scroll,
      // swiper,
      // swiperSlide,
      // NbArticlePanel,
      NButton,
      Cell,
      Group,
      NSwitch,
      NInput,
      ButtonTab,
      ButtonTabItem,
      NHeader
      // ArticleDetails:resolve => {require(['components/ArticleDetails'], resolve)},
    },
    filters:{
      
    },
    mixins:[ArticleHandle],
    data () {
      return {
          //文章详情页配置项
          showArticleDetails: false,
          articleOrigin: '',
          articleId: '',
          //首页banner配置
          bannerImageList: BannerImageList,
          //配置的首页的文章列表菜单
          articleMenuList: MenuList,

          articleList:[],
          allLoaded :false,
          menuDict:[],
          pageSize:PAGESIZE,
          pageNum: 1,
          totalNum:0,
          maxPagesize:0,
          pullDownRefreshObj:{
            threshold:40,
            stop:40,
            txt:'刷新成功'
          },
          swiperOption: {
            pagination: '.swiper-pagination',
            direction: 'horizontal',
            slidesPerView: 1,
            paginationClickable: true,
            mousewheelControl: true,
            loop:true
          }
      }
    },
    methods: {
      onClickGoBack(){
        this.showArticleDetails = false;
      },
      articlesItemClick (item) {
        this.showArticleDetails = true;
        this.articleId = item.id ;
        this.articleOrigin = item.origin;
      },
      onPullingDown(){
        this.pageNum = 1;
        Api.getArticleList({
                PageIndex: this.pageNum,
                PageSize: this.pageSize,
                MenuIds: this.menuIds,
              }).then(res=>{
                this.pageNum = res.Pagination.PageIndex;
                this.pageSize = res.Pagination.PageSize;
                this.totalNum = res.Pagination.Total;
                this.allLoaded = this.pageNum == Math.ceil(this.totalNum/this.pageSize);
                this.articleList =res.Data;
                this.$store.commit('updateLoadingStatus', {isLoading: false});   
              }).catch(err=>{
                this.$refs.scroll.forceUpdate();
                this.$store.commit('updateLoadingStatus', {isLoading: false});
              })
      },
      onPullingUp(){
        this.pageNum++;
        Api.getArticleList({
          PageIndex: this.pageNum,
          PageSize: this.pageSize,
          MenuIds: this.menuIds
        }).then(res=>{
          this.pageNum = res.Pagination.PageIndex;
          this.pageSize = res.Pagination.PageSize;
          this.totalNum = res.Pagination.Total;
          this.allLoaded = this.pageNum == Math.ceil(this.totalNum/this.pageSize);
          this.articleList = this.articleList.concat(res.Data);
        }).catch(err=>{
          this.$refs.scroll.forceUpdate();
        });
      },
      /*
      *通过菜单名称匹配查询对应Id
      * return  false:不存在这个菜单 存在返回对应ID
      */
      getIndexId(name){
          let flag = false;
          for(let item of this.menuDict){
            if(item.Name == name){
              flag = true;
              return item.Id;
            }
          }
          return false;
      },
      /**
       * 特殊匹配要闻直击和最新公告
       * 供展会使用
       */      
      routeToTrade(){
          commonApi.androidApi.jumpToTrade();
      }
    },
    computed:{
      ...mapState({
        symbol: state => state.symbol
      }),
        /**文章列表id拼接，用于首页的列表显示，多菜单按顺序排列*/
       menuIds(){
        let menuIdDict = [];
        this.articleMenuList.forEach(item => {
          if (this.getIndexId(item.name)) {
            console.log('menu', this.getIndexId(item.name));
            menuIdDict.push( this.getIndexId(item.name) );
          }
        })
        console.log('menu', menuIdDict.join(','));
          return menuIdDict.join(',');
      },
      pullUpLoadObj () {
        return this.allLoaded ? false : {
          threshold:0,
          txt:{more:'正在加载', nomore:'已无更多'}
        }
      }
    },
    created () {
      this.$store.commit('updateLoadingStatus', {isLoading: true});
      Api.getMenusList().then(res=>{
        this.menuDict = res.Data;
        this.onPullingDown();       
      }).catch(err=>{
      });    
    }
    
  }
</script>
<style lang='less' >
.nb-home {
  position: relative;
  top: 0;
  height: 100%;
  
}
.nb-home-content{
  background-color: #fff;
}
.home-scroll-wrapper{
  position:relative;
  top:0;
  bottom:0;
  left:0;
}
.swiper-box {
    width: 100%;
    height: 300px;
    margin: 0 auto;
  }
  .swiper-item {
    height: 100%;
    font-size: 18px ;
    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      display:block;
      width: 100%;
      height: 100%;
    }
  }
  .wrapper{
    height:100%;
    overflow:auto;
  }
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
  .home-grid-title{
    display:block;
    font-size:32px;
    margin-bottom:10px;
  }
  .home-grid__link{
        display:block;
        padding:22px 0;
  }
  .home-grid-subtit{
    display:block;
      font-size:24px;
      color:#333;
      margin-bottom:8px;
  }
  .home-grid-text{
      font-size:40px;
  }

.nb-line{
  height:20px;
  background-color: #e9e9e9;
}
 /*menu panel*/
  .nb-menu-con{
    background-color: #fff;
    padding: 5px;
    display: flex;
    justify-content: center; 
    flex-wrap: wrap;
  }
  .nb-menu-box{
    padding:44px 0;
    margin:5px;
    border-radius:3px;
    width: 340px;
    box-sizing:border-box;
  }
  .nb-menu-box__hd{
    /*display:inline-block;*/
    float:left;
    margin-right: 10px;
    width: 68px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    img{
      width: 100%;
      height: 100%;
      display:block;
    }
  }
  .nb-menu-box__bd{
    /*display:inline-block;*/
     float:left;
    .nb-menu-box__title{
        font-size:32px;
        color:#fff;
        font-weight:normal;
        margin-bottom:5px;
    }
    .nb-menu-box__desc{
        font-size:20px;
        color:#fff;
    }
  }
  /*news panel*/
  .nb-news{
      padding:0 10px;

  }
  .nb-news-box{
    display:block;

  }
  .nb-news-box__hd{
        float:left;
        width:20px;
        height:180px;
        margin-right:10px;
        background:url(../../assets/news-slide.png) no-repeat;
        background-size:cover;
    }
    .nb-news-box__bd{
        float:left;
        height:180px;
        box-sizing:border-box;
        padding-top:35px;
        border-bottom:1PX dashed #ccc;
    }
    .nb-news-box__ld{
      float:left;
      width:555px;
      margin-right:10px;
      .nb-news-box__title{
            font-size:32px;
            color:#000;
            font-weight:normal;
            margin-bottom:15px;
            width: 400px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .nb-news-box__subtit{
            font-size:24px;
            color:#000;
            font-weight:normal;
            margin-left:8px;
        }
        .nb-news-box__desc{
            font-size:24px;
            color:#666;
            font-weight:normal;
            margin-bottom:10px;
            line-height: 35px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }

    .nb-news-box__rd{
        float:left;
        height: 100%;
        img{
          display:inline-block;
          height: 92px;
          width: 92px;
        }
    }


/*loadmore css*/
.mint-loadmore-text{
    color:#666;
    font-size:32px;
}


</style>

