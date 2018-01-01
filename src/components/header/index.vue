<template>
  <div class='nb-header'>
    <div class='nb-header-left'>
      <slot name='overwrite-left'>
        <div class='left-arrow' @click='onClickBack' v-show='_leftOptions.showBack'>

        </div>
        <a href="javascript:void(0);" class='nb-header-back' v-show='_leftOptions.showBack' @click='onClickBack'>
          {{ typeof _leftOptions.backText === 'undefined' ? '返回' : _leftOptions.backText}}
        </a>
      </slot>
    </div>
    <h1 class='nb-header-title' @click="$emit('on-click-title')" v-if='!shouldOverWriteTitle'>
      <slot>
        <span v-show='title'>{{ title }}</span>
      </slot>  
    </h1>
    <div class='nb-header-title-area' v-if="shouldOverWriteTitle">
        <slot name='overwrite-title'></slot>
    </div>
    <div class='nb-header-right'>
      <a class='nb-header-support' href="javascript:void(0);" @click.preventDefault @click="$emit('on-click-right')" v-if='rightOptions.showSupport'></a>
      <slot name='right'>
      </slot>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'n-header',
  props: {
    leftOptions: Object,
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showSupport: false
        }
      }
    }
  },
  beforeMount () {
    if (this.$slots['overwrite-title']) {
      this.shouldOverWriteTitle = true
    }
  },
  computed: {
    _leftOptions () {
      return Object.assign({
        showBack: true,
        preventGoBack: false
      }, this.leftOptions || {})
    }
  },
  methods: {
    onClickBack () {
      if (this._leftOptions.preventGoBack) {
        this.$emit('on-click-back')
      }else {
        this.$router ? this.$router.go(-1) : window.history.back()
      }
    }
  },
  data () {
    return {
      shouldOverWriteTitle: false
    }
  }
}
</script>

<style lang ='less'>
  @import '../../style/variable.less';

  .nb-header {
    position: relative;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    height: @header-height;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    background-color: @header-background-color;

  }

  .nb-header .nb-header-title {
    text-align: center;
    font-size: inherit;
    font-weight: normal;
    color: @header-title-color;
  }

  .nb-header-title-area, .nb-header .nb-header-title {
    flex:1;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nb-header .nb-header-left,.nb-header .nb-header-right {
    display: inline-block;
    font-size: inherit;
    color: @header-text-color;
  }
</style>
