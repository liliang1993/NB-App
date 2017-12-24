<template>
  <div>
    <div class='nb-tradeSetting-wrapper'>
      <group class='nbui-cell-group'>
        <x-switch title="快速下单"  :value-map="['false', 'true']" prevent-default @on-click="onQuickOrderClick" v-model='customerConfigs.quickOrder'></x-switch>
        <x-switch title="快速平仓" :value-map="['false', 'true']" prevent-default @on-click="onQuickCloseClick"   v-model='customerConfigs.quicklyClose'></x-switch>
        <!-- <x-switch title="快速启动快讯速递":value-map="['false', 'true']" prevent-default @on-click="onClick($event,'sendMessage')"   v-model='customerConfigs.sendMessage'></x-switch> -->
        <x-switch title="启动交易音效" :value-map="['false', 'true']"  prevent-default @on-click="onClick($event,'tradeNoise')"    v-model='customerConfigs.tradeNoise'></x-switch>
      </group>
    </div>
  </div>
</template>

<script>
import { XSwitch, Group,XHeader, Cell} from 'vux'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    XSwitch,
    Group,
    XHeader,
    Cell
  },
  filters:{
    matchBoolean(item){
        if(item ==='true'){
          return true
        }else{
          return false
        }
    }
  },
  data () {
    return {
      customerConfigs: {},
      newValCache: false,
      currentKey: ''
    }
  },
  created(){
      for( let key in this.configs ) {
        this.$set(this.customerConfigs,key ,this.configs[key] );
      };
      console.log('555', this.customerConfigs);
    // Api.updateConfigInfo({
    //   ConfigKey: 'customSymbolList',
    //   ConfigValue: ''
    // }).then(res => {
    //   commonApi.androidApi.setConfigSuccess();
    // }).catch(err => {
    //   commonApi.androidApi.log('err', err);
    //   commonApi.androidApi.setConfigFail(err);
    // })
  },
  methods:{
    onClick(newVal,currentKey) {
      console.log('event',newVal,currentKey);
      this.$vux.loading.show();
      /**
       * 格式化参数
      */
      let obj = {};
      let params = [];
      let stringNewVal = String(newVal);
      obj[currentKey] = stringNewVal;
      console.log('stringNewVal',obj);
      obj = Object.assign(this.customerConfigs, obj);
      console.log('obj',obj);
      for(let key in obj){
        let value = obj[key];
        params.push({
            ConfigKey: key,
            ConfigValue: value
        })
      };
      Api.updateBatchConfigInfo(params).then(res=>{
        this.$vux.loading.hide();
        this.$set (this.customerConfigs,currentKey,stringNewVal);
        console.log('customerConfigs',this.customerConfigs,stringNewVal);
        this.$store.dispatch('updateConfigs', this.customerConfigs).then(res =>{
           commonApi.androidApi.setConfigInfo(this.configs.quickOrder, this.configs.quicklyClose, this.configs.sendMessage, this.configs.tradeNoise);
        })
      }).catch(err=>{
        this.$vux.loading.hide();
      })
    },
    setCustomerConfig(newVal,key) {
      this.newValCache = newVal;
      this.currentKey = key;
      window.setCustomerConfig = () => {
        this.onClick(this.newValCache, this.currentKey);
      }
    },
    /**
     * 点击快速下单触发
    */
    onQuickOrderClick(newVal,oldVal){
      console.log('newVal',newVal);
      this.newValCache = newVal;
      this.setCustomerConfig(newVal, 'quickOrder');
      let rightEvent = 'window.setCustomerConfig()' 
      console.log('value', this.customerConfigs.quickOrder);
      commonApi.androidApi.showDialog(
        {
          type: 1,
          leftBtn: '暂不设置',
          rightBtn: '确认',
          rightEvent: rightEvent
        }
      );
    },
    /**
     * 点击快速下单触发
    */
    onQuickCloseClick(newVal,oldVal){
      console.log('newVal',newVal);
      this.setCustomerConfig(newVal,'quicklyClose');
      let rightEvent = 'window.setCustomerConfig()' 
      console.log('value', this.customerConfigs.quicklyClose);
      commonApi.androidApi.showDialog(
        {
          type: 2,
          leftBtn: '暂不设置',
          rightBtn: '确认',
          rightEvent: rightEvent
        }
      );
    }
  },
  computed:{
    ...mapState({
      configs: state => state.account.configs
    }),
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
  }
}
</script>
<style lang='less' scoped>

</style>
