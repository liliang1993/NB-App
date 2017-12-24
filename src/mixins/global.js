import Vue from 'vue'
import {isiOS} from 'utils/utils'

Vue.mixin({
  methods: {
    /**
     * 统一处理
    */
    goBackRoute () {
      if ( isiOS() ) {
        let routerList = this.$store.state.routerList;
        let toPath = routerList[routerList.length-1];
        console.log('这是IOS客户端');
        routerList.pop();
        this.$store.commit( 'updateRouterList', routerList );
        this.$router.push({ path: toPath ,query: {direction: 'back'} });
      }else {
        console.log('这是非IOS客户端');
        this.$router.go(-1);
      }
    }
  },
  computed: {
    /**全局的toast */
    toast () {
      let self = this;
      return {
        show (message) {
          self.$vux.toast.show({
            type: 'text',
            text: message,
            position:'middle',
            width: 'auto'
          })
        }
      } 
    },
  }
})