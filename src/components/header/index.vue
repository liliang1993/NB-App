<template>
  <div class='nb-header'>
    <div class='nb-header-left'>
      <slot name='overwrite-left'>
          <a href="javascript:void(0);" class='nb-header-back' v-show='_leftOptions.showBack' @click='onClickBack'>
            {{ typeOf _leftOptions.backText === 'undefined' ? '返回' : _leftOptions.backText}}
          </a>
          <div class='left-arrow' @click='onClickBack' v-show='_leftOptions.showBack'>

          </div>
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
      <a href="javascript:void(0);" @click.preventDefault @click="$emit('on-click-right')" v-if='rightOptions.showMore'></a>
      <slot name='right'>
      </slot>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'x-header',
  props: {
    leftOptions: Object,
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showMore: false
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

<style lang = 'less'>
  @import '../../style/variable.less';

  .nb-header {
    position: relative;
    padding: 3px 0;
    box-sizing: border-box;
    background-color: @header-background-color;
  }

  .nb-header .nb-header-title {
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: @header-title-color;
  }

  .vux-header-title-area, .vux-header .vux-header-title {
  margin: 0 88px;
  height: 40px;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
