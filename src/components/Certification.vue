<template>
  <div>
    <x-header slot="header"
      class='view-header'
      :left-options="leftOptions"
      :right-options="rightOptions"
      title="实名验证"
      :transition="headerTransition"
    >
      <div class="nb-header-left" slot='overwrite-left' @click='$router.back(-1)'>
        <i  class='header-back-icon'>
        </i>
      </div>
    </x-header>
   <div class="nb-wrap">
      <group class='nbui-cell-group'>
        <x-input label-width='2.5rem' title="账户名" v-model='$store.state.user.userInfo.Mt4Account' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.5rem' title="真实姓名" v-model='$store.state.user.userInfo.RealName' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.5rem' title="手机号码" v-model='$store.state.user.userInfo.Phone' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.5rem' title="身份证号码"  placeholder='请输入您的身份证号码' v-model='idCardNumber'>
        </x-input>
      </group>
      <div>
        <p class="certifi-upload-desc">
            身份证上传
            <span class='certifi-upload-tip'>(图片格式为jpg、png、gif,单张小于<em style='color:#48bed4;'>4.00MB</em>)</span>
        </p>
          <div class="show-area flex justify-between">
            <nb-upload
              @imgLoaded ='frontImgLoaded'
              Id='front'
              :DefaultImage='defaultFrontImg'
            >
              <div slot='desc' style='text-align:center'>
                <label for='front' class='upload-bottom-desc'>{{frontImgLoadedFlag ? '更改图片' : '身份证正面'}}</label>
              </div>
            </nb-upload>
            <nb-upload
            @imgLoaded ='backImgLoaded'
            Id='back'
            :DefaultImage='defaultBackImg'
            >
              <div slot='desc' style='text-align:center'>
                <label for='back' class='upload-bottom-desc'>{{backImgLoadedFlag ? '更改图片' : '身份证反面'}}</label>
              </div>
            </nb-upload>
          </div>
      </div>
      <div class="nb-btn_submit nb-btn_primary" @click='uploadIdCrad' >确定</div>
    </div>
  </div>
</template>

<script>
import { Group, XInput,XButton,XHeader } from 'vux'
import NbUpload from './upload.vue'
import Api from '../Api/api'
import commonApi from '../Api/androidApi'
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader,
    NbUpload
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
      frontImgByte: '',
      frontImgLoadedFlag : false,
      defaultFrontImg:'',
      backImgByte: '',
      backImgLoadedFlag: false,
      defaultBackImg:'',
      idCardNumber: ''
    }
  },
  methods:{
    frontImgLoaded(src){
        console.log('src',src);
        this.frontImgLoadedFlag = true;
        this.frontImgByte = src;
    },
    backImgLoaded(src){
      this.backImgLoadedFlag = true;
      this.backImgByte = src;
    },
    uploadIdCrad(){
      
      let param = new FormData();
      param.append('file',this.frontImgByte);
      param.append('file1',this.backImgByte);
      this.$vux.loading.show({
       text: 'Loading'
      })
      Api.uploadIdCard(param).then(res=>{
        let params = {
                  FrontUrl: res.Data[0].FilePath,
                  VersoUrl: res.Data[1].FilePath
                };
        let rightButtonText, rightEvent, message;
        Api.setIdcardRecord(params).then(res=>{
          this.$vux.loading.hide();
          let params = {
            IsUploadIdCard: true
         };
          this.$store.dispatch('updateUserInfo',params);
          if(this.$store.state.route.from == '/withdraw/apply'){
            commonApi.androidApi.showDialog({
                msg: "实名验证成功！",
                leftButton: "继续出金",
                leftEvent: "changeRoute('/withdraw/apply')",
              });
          }else{
            if(!this.$store.state.user.userInfo.BankAccount){
              rightButtonText = '绑定银行卡';
              rightEvent = "changeRoute('/account/bindBank')"
            }else{
              rightButtonText = '前去出金';
              rightEvent = "changeRoute('/withdraw/apply')"
            }
            commonApi.androidApi.showDialog({
              msg: "实名验证成功！",
              leftButton: "返回我的",
              rightButton: rightButtonText,
              leftEvent: "changeRoute('/account')",
              rightEvent: rightEvent
            });
            return;
          }
            
        }).catch(err=>{
          this.$vux.loading.hide();
        });
      }).catch(err=>{
        this.$vux.loading.hide();
      });
      
    }
  },
  mounted(){
    // Api.getIdCard().then(res=>{
    //     this.defaultFrontImg = res.Data.FrontUrl;
    //     this.defaultBackImg = res.Data.VersoUrl;
    // })
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
    }
  }
}
</script>

<style lang='less'>
  .certifi-upload-desc{
    margin-top:40px;
    font-size:32px;
    .certifi-upload-tip{
        font-size:24px;
        color:#666;
    }
  }
  .show-area{
      margin-top: 20px;
      .upload-bottom-desc{
        color:#999;
        font-size:30px;
        padding-top:10px;
      }
  }

</style>
