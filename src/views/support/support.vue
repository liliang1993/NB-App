<template>
  <div class='iframe-wrapper'>
    <div id='iframe-container' >
      <iframe id='iframe' :src="url" frameborder="0" width="100%" height='100%'></iframe>
    </div>
  </div>
</template>

<script>
export default{
  name: 'nb-support',
  components: {

  },
  data(){
    return{
      url:ysf.url(),
      fromRoute:''
    }
  },
  computed:{
    verifyText(){
        if(this.isSend){
          return '倒计时'+this.remainTime+'S'
        }else{
            return '发送验证码'
        }
    },
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
    }
  },
  methods:{
  },
  mounted(){
    this.$nextTick(()=>{
      $('#iframe').height($('#iframe-container').height());
    })
  }
}
</script>

<style>
.iframe-wrapper{
    height:100%;
    box-sizing:border-box;
    overflow: hidden;
}
#iframe-container{
  height:100%;
}
</style>
