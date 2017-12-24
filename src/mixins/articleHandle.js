export default {
    methods:{
        dateFormat(value){
            return value.split(' ')[0];
          },
        
        rebuildScroll() {
            this.$nextTick(() => {
              this.$refs.scroll.initScroll();
            })
        },
    },
    computed:{
        dataListComputed(){
            return this.articleList.map((item, index) => {
                let res = {};
                res.date = this.dateFormat(item.PublishTime);
                res.content = item.ShortDescription;
                res.origin = item.MenuName;
                res.id = item.Id;
                res.tagBgColor = res.origin== '要闻直击' ? '#f2b807' : '#47abff'
                return res;
            })
        }
    }

}