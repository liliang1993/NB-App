<template>
  <div>
    <div class='nb-personal-info'>
      <div  class='nb-personal-info-header'>
          <i class='nb-personal-info-icon' :class='headerIconClass'>

          </i>
      </div>
      <div class='nb-personal-info-body'>
        <group class='nbui-cell-group'>
          <cell title="实名认证" >
            <div class='flex justify-center items-center'>
              <span class='nb-personal-info-cell-text'>{{userInfo.RealName}}</span>
              <i class='nb-personal-info-icon' :class='cellIconClass'></i>
            </div>
          </cell>
          <cell title="证件号码" :value='idNoComputed'>
          </cell>
          <cell title="证件照片" :value='statusText' :is-link = 'isLink'  @click.native = 'routerLinkClick'>   
          </cell>
        </group>  
        <group class='nbui-cell-group' >
          <cell title="手机号">
              {{userInfo.Phone}}
          </cell>
        </group>
      </div>
    </div>
  </div>
</template>


<script>
import {Group,Cell} from 'vux'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import {checkPassword} from 'utils/utils'
import {mapState} from 'vuex'
import accountMixin from 'mixins/account'
export default {
  name: 'personalInfo',
  components: {
    Group,
    Cell
  },
  data () {
    return {
      
    }
  },
  mixins: [accountMixin],
  filters: {
    idCardEncrypt (item) {
      return item.replace(/^(\d{4})\d+(\d{4})$/, "$1****$2");
    }
  },
  methods: {
    routerLinkClick () {
      if( this.userInfo.IsUploadIdCard  == false) {
        this.$router.push({path: '/account/certification'});
      }
    }
  },
  computed:{
    ...mapState({
      userInfo: state => state.user.userInfo,
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
    idNoComputed () {
     return  this.userInfo.IDNO ? this.userInfo.IDNO.replace(/^(\d{4})\d+(\d{4})$/, "$1****$2") : '未完善';
    },
    headerIconClass () {
      return {
        'nb-personal-info-header-icon-filed': !this.userInfo.IsUploadIdCard ,
        'nb-personal-info-header-icon-success': this.userInfo.IsUploadIdCard 
      }
    },
    cellIconClass () {
      return {
        'nb-personal-info-cell-icon-filed': !this.userInfo.IsUploadIdCard ,
        'nb-personal-info-cell-icon-success': this.userInfo.IsUploadIdCard 
      }
    },
    statusText () {
      if(this.userInfo.IsUploadIdCard){

        return '已完善'
      }else {
         return '未认证'
      }
      
    },
    isLink () {
      return this.userInfo.IsUploadIdCard ? false : true;
    }
  },
  created () {
    this.updateUserInfo();
  }
}
</script>
<style lang='less' scoped>
  .nb-personal-info-header {
    height: 378px;
    background: url('../../assets/account/icon-header-bg.png') no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nb-personal-info-icon{
    display: inline-block;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .nb-personal-info-header-icon-filed {
    background-image: url('../../assets/account/icon-header-status-failed.png');
    width: 158px;
    height: 155px;
  }
  .nb-personal-info-header-icon-success {
    background-image: url('../../assets/account/icon-header-status-success.png');
    width: 158px;
    height: 155px;
  }
  .nb-personal-info-cell-icon-filed {
    background-image: url('../../assets/account/icon-cell-status-failed.png');
    width: 120px;
    height: 40px;
  }
  .nb-personal-info-cell-icon-success {
    background-image: url('../../assets/account/icon-cell-status-success.png');
    width: 120px;
    height: 40px;
  }
  .nb-personal-info-cell-text {
    padding-right:5PX;
    font-size: 30px;
  }
</style>
