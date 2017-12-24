<template>
      <div class="nb-views-content">
        <div style='height:100%;position:relative;'>
          <scroll ref="scroll"
            :pullDownRefresh='pullDownRefreshObj'
            :pullUpLoad="pullUpLoadObj"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
            :data = 'articleList'
          >
            <div  class="nb-news list-content" ref='list' v-if='isHaveData'>
              <nb-article-Panel :dataList = 'dataListComputed' :showTag='false' @itemClick = 'articlesItemClick' ></nb-article-Panel>
            </div>
            <null-data v-else></null-data>
          </scroll>  
        </div>
      </div>
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  XHeader,
  Spinner
} from 'vux'
import nullData from 'views/noData/nullData'
import Api from '../Api/api'
import Scroll from './scroll/scroll.vue'
import NbArticlePanel from 'base/articlePanel'
import ArticleHandle from 'mixins/articleHandle'
console.log('scroll',Scroll);
const PAGE_SIZE = 20;
export default {
  name:'ArticleList',
  components: {
    ButtonTab,
    ButtonTabItem,
    XHeader,
    Spinner,
    Scroll,
    NbArticlePanel,
    nullData
  },
  mixins:[ArticleHandle],
  props:{
    menuName:{
      type:String,
      required:true
    }
  },
  data () {
    return {
      articleList:[],
      allLoaded :false,
      menuId:'',
      pageSize:10,
      pageNum: 1,
      totalNum:0,
      isHaveData:true, //是否存在数据，用于初始化数据时标识
      pullDownRefreshObj:{
          threshold:40,
          stop:40,
          txt:'刷新成功'
      }
    }
  },
  filters:{
    /**处理时间显示 */
      dateFilter(value){
        console.log('value',value);
        let arr =value.split(' ');
          return arr[0];
      }
  },
  methods: {
    // 下拉刷新触发事件
    onPullingDown(){
      this.pageNum = 1;
      this.getArticleList().then(res=>{
        this.articleList = res.Data ? res.Data :[] ;
        if (this.articleList.length == 0 ) {
          this.isHaveData = false;
          this.allLoaded  = true; 
        }else {
          this.pageNum = res.Pagination.PageIndex;
          this.pageSize = res.Pagination.PageSize;
          this.totalNum = res.Pagination.Total;
          this.isHaveData = true;
          this.allLoaded = this.pageNum == Math.ceil(this.totalNum/this.pageSize);
        }
      }).catch(error=>{
        this.$refs.scroll.forceUpdate();
      })
    },
    // 点击文章列表单项触发的事件
    articlesItemClick(item){
      console.log('5555',item);
      console.log('menuName',this.menuName);
      this.$emit('onItemClick', item);
    },

    onPullingUp(){
      this.pageNum++;
      this.getArticleList().then(res=>{
        this.pageNum = res.Pagination.PageIndex;
        this.pageSize = res.Pagination.PageSize;
        this.totalNum = res.Pagination.Total;
        this.allLoaded = this.pageNum == Math.ceil(this.totalNum/this.pageSize)
        this.articleList = this.articleList.concat(res.Data);
      }).catch(err=>{
        this.$refs.scroll.forceUpdate();
      })
    },
    initData(){
      //先匹配当前菜单id
      Api.getMenusList().then(res=>{
        for(var item of res.Data){
          if(item.Name == this.menuName){
            this.menuId = item.Id;
            //刷新初始化当前菜单文章列表
            this.onPullingDown();
          }
        }
      })
    },
    getArticleList(){
      console.log('api',this.$route);
      return  Api.getArticleList({
        PageIndex: this.pageNum,
        PageSize: this.pageSize,
        MenuId: this.menuId
      })
    }
  },
  watch:{

  },
  mounted(){
      this.initData();
  },
  computed:{
    pullUpLoadObj () {
      return this.allLoaded ? false : {
        threshold:0,
        // txt:{more:'正在加载', nomore:'已无更多'}
      }      
    }
  }
  
}
</script>
<style lang='less'>
.nb-views-content{

  height:100%;
  box-sizing:border-box;
  width: 100%;
}
</style>

