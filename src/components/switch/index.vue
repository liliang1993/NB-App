<template>
  <div class="vux-x-switch nbui-cell nbui-cell_switch">
    <div class="nbui-cell__bd">
      <label class="nbui-label" :style="labelStyle" :class="labelClass" v-html="title"></label>
      <inline-desc v-if="inlineDesc">{{ inlineDesc }}</inline-desc>
    </div>
    <div class="nbui-cell__ft">
      <input class="nbui-switch" type="checkbox" :disabled="disabled" v-model="currentValue" />
      <div v-if="preventDefault" class="vux-x-switch-overlay" @click="onClick"></div>
    </div>
  </div>
</template>

<script>
// import InlineDesc from '../inline-desc'
import cleanStyle from 'libs/clean-style'
import getParentProp from 'libs/get-parent-prop'

export default {
  name: 'x-switch',
  components: {
    // InlineDesc
  },
  computed: {
    // labelStyle () {
    //   let isHTML = /<\/?[^>]*>/.test(this.title)
    //   let width = Math.min(isHTML ? 5 : (this.title.length + 1), 14) + 'em'
    //   return cleanStyle({
    //     display: 'block',
    //     width: this.$parent.labelWidth || width,
    //     textAlign: this.$parent.labelAlign
    //   })
    // },
    labelStyle () {
      return cleanStyle({
        width: getParentProp(this, 'labelWidth'),
        textAlign: getParentProp(this, 'labelAlign'),
        marginRight: getParentProp(this, 'labelMarginRight')
      });
    },

    labelClass () {
      return {
        'vux-cell-justify': getParentProp(this, 'justify') === 'justify' 
      }
    }
  },
  methods: {
    onClick () {
      this.$emit('on-click', !this.currentValue, this.currentValue)
    },
    toBoolean (val) {
      if (!this.valueMap) {
        return val
      } else {
        const index = this.valueMap.indexOf(val)
        return index === 1
      }
    },
     toRaw (val) {
      if (!this.valueMap) {
        return val
      } else {
        return this.valueMap[val ? 1 : 0]
      }
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    disabled: Boolean,
    value: {
      type: Boolean,
      default: false
    },
    inlineDesc: [String, Boolean, Number],
    preventDefault: Boolean,
    valueMap: {
      type: Array,
      default: () => ([false, true])
    }
  },
  data () {
    return {
      currentValue:  this.toBoolean(this.value)
    }
  },
  watch: {
    currentValue (val) {
      const rawValue = this.toRaw(val)
      this.$emit('input', val)
      this.$emit('on-change', val)
    },
    value (val) {
      this.currentValue = val
    }
  }
}
</script>

<style lang="less">
@import '../../style/nbui/widget/nbui_cell/nbui_form/nbui_form_common';
@import '../../style/nbui/widget/nbui_cell/nbui_switch';

.nbui-cell_switch .nbui-cell__ft {
  font-size: 0;
  position: relative;
  overflow: hidden;
}

input.nbui-switch[disabled] {
  opacity: @switch-disabled-opacity;
}

.vux-x-switch.nbui-cell_switch {
  padding-top: 6px;
  padding-bottom: 6px;
}

.vux-x-switch-overlay {
  width: 60px;
  height: 50px;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
}
</style>