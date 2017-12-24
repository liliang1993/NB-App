<template>
  <div>
    <div
    class="nbui-cells__title"
    v-if="title"
    :style="cleanStyle({
      color: titleColor
    })"
    v-html="title"></div>
    <slot name="title"></slot>
    <div
    class="nbui-cells"
    :class="{
      'vux-no-group-title': !title
    }"
    :style="cleanStyle({
      marginTop: typeof gutter === 'number' ? (gutter + 'px') : gutter
    })">
      <slot name="after-title"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import cleanStyle from 'libs/clean-style'

export default {
  name: 'group',
  methods: {
    cleanStyle
  },
  props: {
    title: String,
    titleColor: String,
    labelWidth: String,
    labelAlign: String,
    labelMarginRight: String,
    gutter: [String, Number]
  }
}
</script>

<style lang="less">
@import '../../style/nbui/widget/nbui_cell/nbui_access';
@import '../../style/nbui/widget/nbui_cell/nbui_cell_global';
@import '../../style/blank.less';

.vux-no-group-title {
  margin-top: @group-title-margin-top;
}

/* global config for group items */
.vux-cell-value {
  color: @cell-value-color;
}
.vux-cell-placeholder {
  color: @cell-placeholder-color;
}
</style>
