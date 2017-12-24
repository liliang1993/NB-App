<template>
  <div>
  <x-header slot="header"
      class='view-header'
      :left-options="leftOptions"
      :right-options="rightOptions"
      title="公司简介"
      :transition="headerTransition"
     >
      <div class="nb-header-left" slot='overwrite-left' @click='$router.back(-1)'>
        <i  class='header-back-icon'>
        </i>
      </div>
  </x-header>
  <div class="article-wrap">
      <div class="article-item">
          <h2 class="article-item-tit">公司介绍</h2>
          <div class="article-item-con">
              <p>
                晋峰环球国际有限公司(简称“晋峰环球”)为香港晋峰金融集团旗下高端金融投资品牌，受新西兰金融市场行为监管局（FSP）授权及监管，牌照编号：FSP513806。晋峰环球为全球投资者提供外汇、贵金属、原油等多元化金融产品在线交易服务，以领先的技术、高端的交易服务和完善的资金保障业内闻名，获得全球逾10万高端投资者认证。
              </p>
              <p>
                以用户为导向的视角和坚实的金融背景，让晋峰环球成为在线投资交易领域高端服务商。从STP直通式交易到流动性供应商，晋峰环球为每个级别的交易者打造最佳的交易环境和资金流动性。无论是经验丰富的操盘手或是一名新手，晋峰环球强大的STP/ECN，都能使您享有透明化的精确交易和无与伦比的交易执行速度。
              </p>
          </div>
      </div>
      <div class="article-item">
          <h2 class="article-item-tit">牌照及监管</h2>
          <div class="article-item-con">
              <div class="item-img">
              </div>
              <p>
               晋峰环球作为一家受FSP全面监管的金融机构，必须遵守FSP制定的严格规则和指引，按规定将客户资金全部存放在经FSP认可的第一级别银行，并且按照新西兰客户资金规则进行维护和管理。请访问FSP官方网站进行核查。
              </p>
          </div>
          <div class="article-item">
            <h2 class="article-item-tit">集团背景</h2>
            <div class="article-item-con">
                <div class="item-img">
                </div>
                <p>
                晋峰金融集团是一个全球多样化经营的金融机构，业务版图覆盖世界20多个国家和地区，交易产品覆盖100多个不同的国际交易市场，致力为全球客户提供多元化、全方位的金融服务。目前集团核心金融业务包括外汇、贵金属、证券、期货、资产管理五大范畴，分别以五大品牌独立经营。
                </p>
                <p>
                  晋峰金融集团由两位具丰富金融投资经验和知识，以及广泛人脉的独立投资者创立，自成立以来快速成长，拥有专业的运营管理团队及强 大的后勤支援部门，负责策略发展、规划设计、技术开发、系统运作及维护、财务、行政、法律咨询及人力资源等，在创新金融领域取得 卓越成绩。
                </p>
            </div>
          </div>
      </div>
      <!-- <div class="article-item">
          <h2 class="article-item-tit">集团背景</h2>
          <div class="article-item-con">
              <p>
                晋峰金融集团是一个全球多样化经营的金融机构，业务版图覆盖世界20多个国家和地区，交易产品覆盖100多个不同的国际交易市场，致力为全球客户提供多元化、全方位的金融服务。目前集团核心金融业务包括外汇、贵金属、证券、期货、资产管理五大范畴，分别以五大品牌独立经营。
              </p>
              <p>
                晋峰金融集团由两位具丰富金融投资经验和知识，以及广泛人脉的独立投资者创立，自成立以来快速成长，拥有专业的运营管理团队及强 大的后勤支援部门，负责策略发展、规划设计、技术开发、系统运作及维护、财务、行政、法律咨询及人力资源等，在创新金融领域取得 卓越成绩。
              </p>
          </div>
      </div> -->
    </div>
  </div>
</template>


<script>
import {XHeader } from 'vux'
export default {
  components:{
    XHeader
  },
  methods: {
    onClick (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.$vux.loading.show({
        text: 'in processing'
      })
      setTimeout(() => {
        this.$vux.loading.hide()
        this.value2 = newVal
      }, 1000)
    }
  },
  data () {
    return {
      value1: true,
      value2: false
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
    }
  }
}
</script>
<style lang='less'>
  .article-wrap{
      padding:80px 20px 0px;
      font-size:26px;
      .article-item{
          padding-top:20px;
      }
      .article-item-tit{
        font-weight:normal;
        color:#48bed4;
        margin-bottom:10px;
      }
      .article-item-con{
          .item-img{

          }
          p{
            line-height:36px;
            text-align:justify;
            color:#666;
          }
      }
  }
</style>
