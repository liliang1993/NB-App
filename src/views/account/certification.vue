<template>
  <div>
    <div class="nb-account">
      <group class='nbui-cell-group'>
        <x-input class='readonly-cell' label-width='2.5rem' title="账户名" v-model='userInfo.Mt4Account' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input class='readonly-cell' label-width='2.5rem' title="真实姓名" v-model='userInfo.RealName' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input class='readonly-cell' label-width='2.5rem' title="手机号码" v-model='userInfo.Phone' :readonly="true">
        </x-input>
      </group>
      <group class='nbui-cell-group'>
        <x-input label-width='2.5rem' title="身份证号码"  :class='{ "readonly-cell": isReadonly}' placeholder='请输入您的身份证号码' v-model='IDNO' :readonly="isReadonly" >
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
      <!-- <div class="nb-btn_submit nb-btn_primary" @click='uploadIdCrad' >确定</div> -->
      <x-button type="primary"  style="border:1px solid #48bed4; margin-top:20px;"   @click.native='uploadIdCrad'>保存</x-button>
    </div>
  </div>
</template>

<script>
import { Group, XInput,XButton,XHeader } from 'vux'
import NbUpload from 'components/upload'
import { checkIdNum } from 'utils/utils'
import Api from 'api/api'
import commonApi from 'api/androidApi'
import {mapState} from 'vuex'
import accountMixin from 'mixins/account'
export default {
  components: {
    Group,
    XInput,
    XButton,
    XHeader,
    NbUpload
  },
  mixins: [accountMixin],
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
      IDNO:''
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
      if(!checkIdNum(this.IDNO)){
        this.toast.show('身份证号码格式不合法');
        return;
      }
      if( !(this.frontImgLoadedFlag && this.backImgLoadedFlag) ){
        this.toast.show('请选择相应照片上传');
        return; 
      }
      let param = new FormData();
      param.append('file',this.frontImgByte);
      param.append('file1',this.backImgByte);
      this.$vux.loading.show({
       text: 'Loading'
      });
      /**
       * 发送身份证号验证请求
      */
      Api.setIdcardauth({IDNO : this.IDNO}).then(res=>{

        /**
         * 成功后上传图片请求
        */
        Api.uploadIdCard(param).then(res=>{

            let params = {
              FrontUrl: res.Data[0].FilePath,
              VersoUrl: res.Data[1].FilePath
            };
          let rightButtonText, rightEvent, message;
          /**
           * 将接收到的图片地址回传
          */
          Api.setIdcardRecord(params).then(res=>{
            this.$vux.loading.hide();
            this.updateUserInfo();
            /***/
            /**
             * 判断路由的来向来确定弹出的dialog选项框内容
            */
            if(this.$store.state.route.from == '/capital'){
              commonApi.androidApi.showDialog({
                  msg: "实名验证成功！",
                  leftButton: "前去入金",
                  leftEvent: "changeRoute('/capital/depositApply')",
                });
            }else{
              if(!this.$store.state.user.userInfo.BankAccount){
                rightButtonText = '绑定银行卡';
                rightEvent = "changeRoute('/account/bindBank')"
              }else{
                rightButtonText = '前去入金';
                rightEvent = "changeRoute('/capital/depositApply')"
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
            this.$router.push({path:'/account/personalInfo'});
            });
        }).catch(err=>{
          this.$vux.loading.hide();
          this.$router.push({path:'/account/personalInfo'});
        });
      }).catch(err=>{
        this.$vux.loading.hide();
        this.$router.push({path:'/account/personalInfo'});
      });
    }
  },
  computed:{
    ...mapState ({
      userInfo : state => state.user.userInfo
    }) ,
    isReadonly () {
      return this.userInfo.IDNO ? true : false;
    }
  },
  created(){
    this.IDNO = this.userInfo.IDNO ? this.userInfo.IDNO : '';
    // Api.getIdCard().then(res=>{
    //     this.defaultFrontImg = res.Data.FrontUrl;
    //     this.defaultBackImg = res.Data.VersoUrl;
    // })
  }
}
</script>

<style lang='less'>
  .nb-account {
    padding: 0 30px;
  }
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
