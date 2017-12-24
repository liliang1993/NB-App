<template>
    <div class='newb-articlePanel'>
        <ul class='newb-articlePanel-warpper'>
            <li class='newb-articlePanel-item vux-tap-active' v-for='( item, index) in dataList' @click='panelItemClick(item)' >
                <div class='newb-articlePanel-item-title'>
                    <div class='newb-articlePanel-item-title--left'>
                        {{item.date}}           
                    </div>
                    <div v-show='showTag'class='newb-articlePanel-item-title--right' :style='{backgroundColor: item.tagBgColor}'>
                        {{item.origin}}
                    </div>
                </div>
                <div class="newb-articlePanel-item-body" v-html='item.content'>       
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'nb-articlePanel',
    props:{
        dataList: Array,
        tagBgColor: {
            type: String,
            default: '#47abff'
        },
        showTag: {
            type:Boolean,
            default: true
        }
    },
    methods:{
        panelItemClick(item){
            this.$emit('itemClick' , item);
        }
    }
}
</script>
<style lang='less'>

   .newb-articlePanel{
       padding-top: 20px;
       padding-left: 28px; 
       padding-right: 28px;
   } 
   .newb-articlePanel-item{
       padding-bottom: 40px; 
       padding-left: 52px;
       border-left: 2PX solid #e7e7e7;
   }
   .newb-articlePanel-item-title{
       position: relative;
       display: flex;
       align-items: center;
       font-size:24px;
       height: 45px;
       line-height: 45px ;
   }
   .newb-articlePanel-item-title:before{
       content:'';
       width:52px;
       height: 2px;
       position: absolute;
       left: -52px;
        top:50%;
        background-color:#e7e7e7;

   }
   .newb-articlePanel-item-title:after{
       content:'';
       width:14px;
       height: 14px;
       border-radius:50%;  
       position: absolute;
       left: -52px;
       top:50%;
       transform: translate(-50%, -50%);
       background-color:#4993a1;
        box-shadow: 0 0 0 8px #e7e7e7;
   }
   .newb-articlePanel-item-title--left{
       color:#999;
       padding:0 16px;      
       background-color: #eaebe6;
       border-radius:20px;
       margin-right:12px; 
   }
   .newb-articlePanel-item-title--right{
       color:#fff;
        padding:0 16px;
       background-color: #47abff;;
       border-radius:20px;
   }
    .newb-articlePanel-item-body{
        color:#666666;
        text-align: justify;
        font-size: 26px;
        line-height: 1.8;
        padding-top: 20px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>

