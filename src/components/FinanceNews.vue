<template>
  <div class="nb-financeNews">
    <drawer
      width="200px;"
      :show.sync="drawerVisibility"
      :show-mode="showModeValue"
      :placement="showPlacementValue"
      :drawer-style="{'background-color':'#fff', width: '83%',height:'100%'}"
      :style ="{overflow:'hidden'}"
      >
            <!-- drawer content -->
      <div slot="drawer">
        <div class='filter-box__hd'>
          <div class="filter-box-item" v-for='(item,index) in filterOptions'>
              <h2 class="filter-box-title">{{item.title}}</h2>
              <div class="filter-box-desc">
                  <div class="filter-box-option" :class="[option.active?'active':'']" @click='selectOption(option,key)' v-for='(option,key) in item.options'>
                    {{option.text}}
                  </div>
              </div>
          </div>
        </div>
        <flexbox class='drawer-content-ft'>
          <flexbox-item><x-button plain >重置</x-button></flexbox-item>
          <flexbox-item><x-button type='primary' @click.native='drawerVisibility=false'>确定</x-button></flexbox-item>
        </flexbox>
      </div>
      <div style='height:100%;'>
      <div class="nb-cal-box ">
            <div class='cal-box-hd__date' id='demo'>
              <i class='icon-calendar' >
              </i>
            </div>
            <div class="cal-box-md flex items-center justify-center">
              <a href="#" class='cal-box-md__slider cal-box-md__prev' @click.prevent='prevDateList'>
                <
              </a>
              <ul class='cal-box-md__ul flex flex-row'>
                <li  class='cal-box__li flex justify-center items-center flex-column' v-for='(item,index) in dateList' @click='selectStyle(item,index)' :class="[item.selected?'current':'']" :key='index'>
                    <span class='cal-box__week'>{{item.time | weekMatch}}</span>
                    <i class='cal-box__desc'>{{item.time | dateFormat}}</i>
                </li>
              </ul>
              <a href="" class='cal-box-md__slider cal-box-md__next' @click.prevent='nextDateList'>
                >
              </a>
            </div>
            <div class="cal-box-bd" @click='drawerVisibility = true'>
              筛选
            </div>
        </div>
        <scroll ref='scroll'>
          <div class="calendar-content-view">
            <div class="cal-table-box">
              <ul class='finance-list' v-show = 'isHaveData'>
                <li class='finance-item' v-for='(item,index) in filterFinanceNews' :key='index'>
                  <div class='finance-link flex'>
                    <div class='finance-date'>{{item.Time}}</div>
                    <div class='finance-info  flex-column flex-grow-1'>
                        <div class='finance-info-hd flex items-center'>
                          <i class="icon-country" :style="{backgroundImage:'url('+countryFlagList[index]+')'}"></i>
                          <span class='finance-country-name'>{{item.CountryName}}</span>
                          <i :class="['icon-star','star-'+item.Weightiness]"></i>
                        </div>
                        <div class='finance-info-md'>
                          <small class='finance-info-value'>前值<span >{{item.Previous?item.Previous:'--'}}</span></small>
                          <small class='finance-info-value'>预测值<span>{{item.Predict?item.Predict:'--'}}</span></small>
                          <small class='finance-info-value'>公布值<span>{{item.CurrentValue?item.CurrentValue:'--'}}</span></small>
                        </div>
                        <div class='finance-info-bd'>
                          <p class='finance-info-desc'>
                            {{item.Content}}
                          </p>
                        </div>
                    </div>
                  </div>
                </li>
              </ul>
              <null-data v-show = '!isHaveData'>
              </null-data> 
            </div>
          </div>
        </scroll>
      </div>
    </drawer>
    <loading v-if = 'isLoading'></loading>
  </div>
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  XHeader,
  XButton,
  Drawer,
  Flexbox,
  FlexboxItem
} from 'vux'
import Api from 'api/api'
import Scroll from 'components/scroll/scroll'
import NullData from 'views/noData/nullData'
import Loading from 'components/loading'
const CountryFlag = {
    '中国' : require('../../static/country-cn.png'),
    '澳大利亚' : require('../../static/country-aut.png'),
    '德国' : require('../../static/country-de.png'),
    '瑞士' : require('../../static/country-ch.png'),
    '法国' : require('../../static/country-fra.png'),
    '韩国' : require('../../static/country-ka.png'),
    '加拿大' : require('../../static/country-ca.png'),
    '美国' : require('../../static/country-usa.png'),
    '欧元区' : require('../../static/country-eu.png'),
    '日本' : require('../../static/country-jp.png'),
    '香港' : require('../../static/country-hk.png'),
    '新加坡' : require('../../static/country-sgp.png'),
    '新西兰' : require('../../static/country-nl.png'),
    '意大利' : require('../../static/country-ita.png'),
    '英国' : require('../../static/country-uk.png'),
    '中华民国' : require('../../static/country-prc.png')
}
export default {
  name:'financeNews',
  components: {
  ButtonTab,
  ButtonTabItem,
  XHeader,
  Drawer,
  Scroll,
  XButton,
  Flexbox,
  FlexboxItem,
  NullData,
  Loading
  },
  data () {
    return {
      isHaveData: true,
      middleDate: '',
      selectTime: '',
      dateList:[],
      filterOptions:[{
        title:'地区',
        options:[{text:'中国'},{text:'美国'},{text:'欧元区'},{text:'英国'},{text:'日本'},{text:'加拿大'},{text:'澳大利亚'},{text:'瑞士'},{text:'新加坡'}]
      },{
        title:'星级',
        options:[{text:'1星',value:'1'},{text:'2星',value:'2'},{text:'3星',value:'3'}]
      },{
        title:'类型',
        options:[{text:'通胀'},{text:'就业'},{text:'贸易'},{text:'央行'},{text:'经济活动'},{text:'商品'},{text:'资本市场'},{text:'房产市场'},{text:'信息指数'},{text:'其他'}]
      }],
      financeNews:[],
      filterFinanceNews:[],
      sliderZIndex:0,
      drawerVisibility:false,
      showModeValue:'overlay',
      showPlacement: 'right',
      showPlacementValue: 'right',
      isLoading: false
    }
  },
  filters:{
    weekMatch(item){
      var dt = new Date(item.replace(/-/g, '/'));
      console.log('dt',dt.getDay(),dt,item);
      var a = ['周日', '周一','周二','周三','周四','周五','周六'];
      return a[dt.getDay()]
    },
    dateFormat(item){
       var arr = item.split('-');
       return arr[1]+'-'+arr[2];
    }
  },
  methods: {
    rebuildScroll() {
        this.$nextTick(() => {
          console.log('123',this);
           // this.$refs.scroll.destroy();
          this.$refs.scroll.initScroll();

        })
    },
    toArticleList(menuName) {
       Api.getMenusList().then(res => {
         for (var item of res.Data) {
           if (item.Name == menuName) {
             let menuId = item.Id;
             this.$router.push({
                        path:'/articles/'+menuId,
                        params:{id:menuId}
                      })
           }
         }
       })
     },
    clickItemMiddle(){
        this.toArticleList('要闻速递');
    },
    clickItemRight(){
        this.toArticleList('平台公告');
    },
    /**
     * [selectStyle 改变日期列表时的类名变化]
     * @param  {[type]} item  [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    selectStyle(item,index){
　　　this.dateList.forEach((item)=>{
　　　　 this.$set(item,'selected',false);
　　　});
　　　this.$set(item,'selected',true);
      this.selectTime = item.time;
      this.loadData();
    },
    selectOption(option,key){
          this.$nextTick(()=>{
                if(option.active){
                    this.$set(option,'active',false);
                  }
                else{
  　　　　　　　　this.$set(option,'active',true);
                }
  　　　　　　});
    },
    /**
     * [loadData ]
     * @return {[type]} [description]
     */
    loadData(){
      // this.$store.commit('update')
      // this.$store.commit('updateLoadingStatus', {isLoading: true});
      this.isLoading = true;
      Api.getFinanceNews({DateTime: this.selectTime}).then(res=>{
        this.isLoading = false;
        // this.$store.commit('updateLoadingStatus', {isLoading: false});
        this.financeNews= [];
        let result = JSON.parse(res.Data);
        let list = result.groupFinancialCalendarData;
        for(var group of list){
            for(var item of group){
              this.financeNews.push(item);
            }
        }
        this.filterFinanceNews  = this.filterList(this.financeNews);
        console.log('filterFinanceNews', this.filterFinanceNews);
        if( this.filterFinanceNews.length == 0) {
          this.isHaveData = false;
        }else{
          this.isHaveData = true;
        }
        this.rebuildScroll();
      }).catch(err=>{
        this.$store.commit('updateLoadingStatus', {isLoading: false});
      })
    },
    /**
     * [getDateStr 获得某一天前后n天的日期]
     * @param  {[type]} da          [指定的日期 格式为'yyyy-mm-dd']
     * @param  {[type]} AddDayCount [指定的日期的第n天 -1:前1天 1:后1天]
     * @return {[type]}             [返回的指定的日期的第n天的日期 格式：yyyy-mm-dd]
     */
    getDateStr(da,AddDayCount){
    console.log('da',da);
    var da = (da.replace(/-/g, "/"))
    var dd = new Date(da);
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    console.log('y',y,dd,dd.getDate());
    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate(); //获取当前几号，不足10补0
    return y+"-"+m+"-"+d;
    },
    /**
     * [filterList 筛选过滤函数]
     * @param  {[type]} list [需过滤的列表]
     * @return {[type]}      [过滤后的列表]
     */
    filterList(list){
        // 筛选内容国家
      let  secondFilterList = [],countryFilter = [];
      for(let item of this.filterOptions[0].options){
        if(item.active){
            countryFilter.push(item.text);
        };
      };
      if(countryFilter.length == 0){
          secondFilterList = list;
      }else{
        countryFilter.forEach((name,key)=>{
          list.forEach((item,index)=>{
              if( name == item.CountryName){
                secondFilterList.push(item);
              }
          })
        })
      };
      //筛选类型星级重要性
      let  threeFilterList = [],starFilter = [];
      for(let item of this.filterOptions[1].options){
        if(item.active){
            starFilter.push(item);
        };
      };
      if(starFilter.length == 0){
        threeFilterList = secondFilterList;
      }else{
        starFilter.forEach((star,key)=>{
          secondFilterList.forEach((item,index)=>{
              if( star.value == item.Weightiness){
                threeFilterList.push(item);
              }
          })
        })
      }
      //筛选内容的类型
      let  fourFilterList = [],typeFilter = [];
      for(let item of this.filterOptions[2].options){
        if(item.active){
            typeFilter.push(item.text);
        };
      };
      if(typeFilter.length == 0){
        fourFilterList = threeFilterList;
      }else{
        typeFilter.forEach((type,key)=>{
          threeFilterList.forEach((item,index)=>{
              if( type == item.DataTypeName){
                fourFilterList.push(item);
              }
          })
        })
      }
      return fourFilterList;
    },
    /**
     * [nextDateList 点击前进按钮的触发事件]
     * @return {[type]} [description]
     */
    nextDateList(){
        this.middleDate = this.getDateStr(this.middleDate,5);
    },
    /**
     * [prevDateList 点击后退按钮的触发事件]
     * @return {[type]} [description]
     */
    prevDateList(){
       this.middleDate = this.getDateStr(this.middleDate,-5);
    }
  },
  mounted(){
    var instance,
    now = new Date(),
    max = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
    instance = mobiscroll.calendar('#demo', {
        theme: 'material',
        lang: 'zh',
        display: 'top',
        max: max,
        dateFormat:'yyyy-mm-dd',
        onSet: (value,inst)=>{
            console.log('timeValue',value);
            this.selectTime =value.valueText;
            this.middleDate = value.valueText;
            console.log('middle',this.middleDate);
            this.loadData();
        }
    });

    this.selectTime = this.middleDate = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
    this.loadData();
  },
  watch:{
    middleDate(value){
      this.dateList = [];
      for(var i = -2;i <3;i++){
        let time = this.getDateStr(value,i);
        this.dateList.push({time:this.getDateStr(this.middleDate,i),selected:  time==this.selectTime ? true:false});
        i
      }
    },
    drawerVisibility(value){
        if(value == false){
          this.filterFinanceNews  = this.filterList(this.financeNews);
          if( this.filterFinanceNews.length == 0) {
            this.isHaveData = false;
          }else{
            this.isHaveData = true;
          }
        }
    }
  },
  computed:{
    leftOptions () {
      return {
        // showBack: this.route.path !== '/'
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
    /**
     * [countryFlagList 匹配国旗图案]
     * @return {[type]} [description]
     */
    countryFlagList(){
      return this.filterFinanceNews.map((item,index)=>{
          return CountryFlag[item.CountryName];
      })
    }
  }
}
</script>
<style lang='less'>

.calendar-content-view{
    padding-top:110px;
    height:100%;
    box-sizing:border-box;
}
  .nb-cal-box{
      height: 108px;
      background-color: #48bed4;
      display:flex;
      justify-content:space-between;
      align-items:center;
      width: 100%;
      position:absolute;
      top:0;
      z-index:100;
  }
  .cal-box-hd__date{
    padding-left:20px;
  }
  .icon-calendar{
    display: inline-block;
    width: 40px;
    height:40px;
    background: url(../assets/cal-date.png) no-repeat center; 
    background-size: contain;
  }
  .cal-box-md{
      position: relative;
      height:108px;
      padding:0 45px;
      .cal-box-md__slider{
      color:#fff;
      display:block;
      width:45px;
      height: 45px;
      position: absolute;
      text-align: center;
      line-height: 45px;
      font-size:30px;
      transform:translateY(-50%);
          top:50%;
      }
      .cal-box-md__prev{
          left:0;
      }
      .cal-box-md__next{
          right:0;
      }
  }
  .cal-box-md__ul{
      height:108px;
      margin-right:-20px;
  }
  .cal-box__li{
      padding:0 2px;
      font-size:26px;
      font-weight:normal;
      margin-right:20px;
        color:#fff;
        border-bottom:2PX solid transparent;
      &.current{
          border-bottom:2PX solid #f9ff9f;
      }
      .cal-box__week{
          margin-bottom:10px;

      }
  }
  .cal-box-bd{
      height:108px;
      color:#fff;
      font-size:30px;
      line-height:108px;
      padding-right:20px;
  }
  .nb-financeNews{
    height:100%;
    width: 100%;
    position:relative; 
  }
/*calendar css*/
.cal-table-box{
    padding-left:20px;
    padding-right:20px;
    height:100%;
    overflow:scroll;
}
.finance-list{

}
.finance-item{
  font-size:24px;
  padding-top:20px;
  padding-bottom:20px;
  border-bottom:1px solid #ddd;

}
.finance-link{

}

.nbui-list-end{
    font-size:20px;
    color:#999;
    text-align:center;
    padding:20px 0;
}
.finance-date{
  color:#999;
  padding-top:5px;
  width: 100px;
}
.finance-info{
  .finance-info-hd{
      color:#999;
      margin-bottom:15px;
      .finance-country-name{
          margin-left:15px;
          margin-right:15px;
      }
      .icon-country{
          display:inline-block;
          width: 38px;
          height:38px;
          background-size:contain;
      }
      .icon-star{
          display:inline-block;
          width: 78px;
          height:40px;
          background-repeat:no-repeat;
          background-position:center;
          background-size:contain;
      }
  }
  /*star css*/
  .star-1{
    background-image:url('../assets/icon-star1.jpg')
  }
  .star-2{
    background-image:url('../assets/icon-star2.jpg')
  }
  .star-3{
    background-image:url('../assets/icon-star3.jpg')
  }

  .finance-info-md{
     margin-bottom:15px;
    small{
      &+small{
          margin-left:20px;
      }
    }
    .finance-info-value{
      font-size:24px;

      span{
         color:#999;
        margin-left:10px;
      }
    }
  }
  .finance-info-bd{
    .finance-info-desc{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
/*filter panel*/
 .filter-box__hd{
      margin-bottom:40px;
    }
    .filter-box-item{
        padding:20px 20px 0px;
        border-bottom:1PX solid #ccc;
            }
    .filter-box-title{
        font-size:32px;
        color:#666;
        font-weight:normal;
        margin-bottom: 20px;
    }
    .filter-box-desc{
      display:flex;
      justify-content:space-between;
      align-items:center;
      flex-wrap:wrap;
    }
    .filter-box-option{
        width: 175px;
        height: 66px;
        margin-bottom:20px;
        text-align:center;
        line-height: 66px;
        border:1PX solid #ccc;
        border-radius:3px;
        font-size:26px;
        color:#666;
        font-weight:normal;
    }
    .filter-box-option.active{
      background-color: #48bed4;
      color:#fff;
      border-color:#48bed4;
    }
    .drawer-content-ft{
      padding: 0 20px;
    }
    
  /*calendar css*/
.mbsc-material .mbsc-fr-btn{
  color: #48bed4;
}
.mbsc-material .mbsc-cal-btn-txt{
  color: #48bed4;
}
.mbsc-material .mbsc-cal .mbsc-cal-day-sel .mbsc-cal-day-fg{
  background:rgba(72,190,212,.3);
}
.mbsc-material .mbsc-cal-hl-now .mbsc-cal-today{
  color: #48bed4;
}

/*over vux css*/
.vux-drawer > .vux-drawer-active{
  backface-visibility: hidden;
  }
.vux-drawer > .drawer-right{
  backface-visibility: hidden;
  }
</style>

