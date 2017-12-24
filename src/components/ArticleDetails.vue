<template>
  <div style='position:absolute;top:0;width:100%;height:100%;background-color:#fff;z-index:100;'>
      <x-header slot="header"
        style="width:100%;position:fixed;left:0;top:0;z-index:250;"
        class='vux-1px-b'
        :left-options="leftOptions"
        :right-options="rightOptions"
        :title="origin"
        @on-click-back = 'onClickBack'
      >
      </x-header> 
      <!-- <scroll ref="scroll"
          :pullDownRefresh='false'
          :pullUpLoad="false"
          :data = 'articleDetails'
        > -->
        <div class="news-detail-views">
          <h2 class='news-details-title'>{{articleDetails.Name}}</h2>
          <p class='news-details-publishTime'>{{articleDetails.PublishDate}}</p>
          <div class='article-edit-view' v-html='articleDetails.FullDescription'>
          </div>
        </div>
      <!-- </scroll>       -->
  </div>
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  XHeader
} from 'vux'
import Scroll from 'components/scroll/scroll.vue'
import Api from '../Api/api'
import{mapState} from 'vuex'
export default {
  components: {
    ButtonTab,
    ButtonTabItem,
    XHeader,
    Scroll
  },
  props:{
    id: Number,
    origin: String
  },
  methods: {
    onClickBack(){
      this.$emit ('onClickGoBack');
    },
     rebuildScroll() {
        // this.$nextTick(() => {
        //    this.$refs.scroll.destroy();
        //   this.$refs.scroll.initScroll();
        // })
      }
  },
  computed:{
    ...mapState({
      fromRoute: state => state.route.from
    }),
    leftOptions () {
      return {
        preventGoBack: true,
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
    }
  },
  mounted(){
    console.log('params123',this.$route);
      let url ='/v1/cms/article/detail/'+this.id
      Api.getArticleDetails(url,{id: this.id}).then(res=>{
          this.articleDetails = res.Data;
          this.articleDetails.PublishDate = res.Data.PublishTime.split('T')[0];
          // 替换内部样式style
          this.articleDetails.FullDescription = this.articleDetails.FullDescription.replace(new RegExp(/style="[^\"]*?"/g),'');
          console.log('FullDescription',this.articleDetails.FullDescription);
          this.$nextTick(()=>{
              $('p>span>br').parent().parent().remove();
              $('p').each(function(){
                  console.log('html',$(this).html());
                  if($(this).html()=='<br>'){
                    $(this).remove();
                  }
              })
          })
      })
  },
  data () {
    return {
        articleDetails:{},
        swiperOption: {
          direction: 'vertical',
          slidesPerView: 'auto',
          freeMode: true,
          scrollbar: {
            el: '.swiper-scrollbar'
          }
      }
    }
  }
}
</script>
<style lang='less' scoped>
.news-detail-views{
  width:100%;
  // height:100%;
  background-color: #fafafa;
  padding:110px 50px 20px; 
  h2 {
    line-height: 1.4;
  }
}
.news-details-title{
    font-size:36px;
    font-weight:normal;
    margin-bottom:10px;
}
.news-details-publishTime{
    font-size:26px;
    color:#999;
}
.article-edit-view{
  margin-top:10px;
  font-size:32px;
  line-height:50px;
  text-align:justify;
  
  p{
    color:#666;
  }
  img{
    display:block;
    width: 100%;
  }
}
.swiper-slide.text {
    font-size: 18px!important;
    text-align: left!important;
    height: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 30px;
    > .content {
      > .title {
        margin: 0;
        text-align: center;
        margin-bottom: .75em;
      }
      > p,
      blockquote {
        line-height: 2;
        text-indent: 2em;
      }
      blockquote {
        background-color: #ddd;
        margin-left: 2em;
      }
    }
  }
</style>

