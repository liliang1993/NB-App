<template>
  <button class="nbui-btn" :class="classes" :disabled="disabled" :type="actionType" @click="onClick">
    <i class="nbui-loading" v-if="showLoading"></i>
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
import { go } from '../../libs/router'

export default {
  name: 'nb-button',
  props: {
    type: {
      default: 'default'
    },
    disabled: Boolean,
    mini: Boolean,
    plain: Boolean,
    text: String,
    actionType: String,
    showLoading: Boolean,
    link: [String, Object]
  },
  methods: {
    onClick () {
      !this.disabled && go(this.link, this.$router)

    }
  },
  computed: {
    classes () {
      return [
        {
          'nbui-btn_disabled': this.disabled,
          'nbui-btn_mini': this.mini
        },
        `nbui-btn_${this.type}`,
        this.plain ? `nbui-btn_plain-${this.type}` : '',
        this.showLoading ? `nbui-btn_loading` : ''
      ]
    }
  }
}
</script>

<style lang="less">
@import '../../style/nbui/widget/nbui-button/nbui-button.less';
@import '../../style/nbui/widget/nbui-loading/nbui-loading.less';
</style>