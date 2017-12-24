<template>
  <div class="vux-x-input nbui-cell">
    <div class="nbui-cell__hd">
      <slot name="label">
        <label class="nbui-label" :class="labelClass" :style='labelStyles' v-if="title" v-html="title" :for="`vux-x-input-${uuid}`"></label>
        <inline-desc v-if="inlineDesc">{{inlineDesc}}</inline-desc>
      </slot>
    </div>
    <div class="nbui-cell__bd nbui-cell__primary" :class="placeholderAlign ? `vux-x-input-placeholder-${placeholderAlign}` : ''">
      <input
      :id="`vux-x-input-${uuid}`"
      v-if="!type || type === 'text'"
      class="nbui-input"
      :maxlength="max"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
      :style="inputStyle"
      type="text"
      :name="name"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      v-model="currentValue"
      @focus="focusHandler"
      @blur="onBlur"
      @keyup="onKeyUp"
      ref="input"/>
      <input
      :id="`vux-x-input-${uuid}`"
      v-if="type === 'number'"
      class="nbui-input"
      :maxlength="max"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
      :style="inputStyle"
      type="number"
      :name="name"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      v-model="currentValue"
      @focus="focusHandler"
      @blur="onBlur"
      @keyup="onKeyUp"
      ref="input"/>
      <input
      :id="`vux-x-input-${uuid}`"
      v-if="type === 'email'"
      class="nbui-input"
      :maxlength="max"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
      :style="inputStyle"
      type="email"
      :name="name"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      v-model="currentValue"
      @focus="focusHandler"
      @blur="onBlur"
      @keyup="onKeyUp"
      ref="input"/>
      <input
      :id="`vux-x-input-${uuid}`"
      v-if="type === 'password'"
      class="nbui-input"
      :maxlength="max"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
      :style="inputStyle"
      type="password"
      :name="name"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      v-model="currentValue"
      @focus="focusHandler"
      @blur="onBlur"
      @keyup="onKeyUp"
      ref="input"/>
      <input
      :id="`vux-x-input-${uuid}`"
      v-if="type === 'tel'"
      class="nbui-input"
      :maxlength="max"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
      :style="inputStyle"
      type="tel"
      :name="name"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      v-model="currentValue"
      @focus="focusHandler"
      @blur="onBlur"
      @keyup="onKeyUp"
      ref="input"/>
    </div>
    <div class="nbui-cell__ft">
      <!-- <icon type="clear" v-show="!equalWith && showClear && currentValue && !readonly && !disabled" @click.native="clear"></icon> -->

      <!-- <icon @click.native="onClickErrorIcon" class="vux-input-icon" type="warn" :title="!valid ? firstError : ''" v-show="showWarn"></icon>
      <icon @click.native="onClickErrorIcon" class="vux-input-icon" type="warn" v-if="!novalidate && hasLengthEqual && dirty && equalWith && !valid"></icon>
      
      <icon type="success" v-show="!novalidate && equalWith && equalWith === currentValue && valid"></icon>

      <icon type="success" class="vux-input-icon" v-show="novalidate && iconType === 'success'"></icon>
      <icon type="warn" class="vux-input-icon" v-show="novalidate && iconType === 'error'"></icon> -->

      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
  import Base from 'libs/base'
  import getParentProp from 'libs/get-parent-prop'
  import cleanStyle from 'libs/clean-style'
  import isEmail from 'validator/lib/isEmail'
  import isMobilePhone from 'validator/lib/isMobilePhone' 
  import Debounce from 'tools/debounce'
  import mask from 'vanilla-masker'

  const validators = {
    'email': {
      fn: isEmail,
      msg: '邮箱格式'
    },
    'china-mobile': {
      fn (str) {
        return isMobilePhone(str, 'zh-CN')
      },
      msg: '手机号码'
    },
    'china-name': {
      fn (str) {
        return str.length >= 2 && str.length <= 6
      },
      msg: '中文姓名'
    }
  }

  export default {
    name: 'x-input',
    mixins: [Base],
    props: {
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: String,
      value: [String, Number],
      name: String,
      readonly: Boolean,
      disabled: Boolean,
      keyboard: String,
      inlineDesc: String,
      isType: [String, Function],
      min: Number,
      max: Number,
      showClear: {
        type: Boolean,
        default: true
      },
      equalWith: String,
      textAlign: String,
      // https://github.com/yisibl/blog/issues/3
      autocomplete: {
        type: String,
        default: 'off'
      },
      autocapitalize: {
        type: String,
        default: 'off'
      },
      autocorrect: {
        type: String,
        default: 'off'
      },
      spellcheck: {
        type: String,
        default: 'false'
      },
      novalidate: {
        type: Boolean,
        default: false
      },
      iconType: String,
      debounce: Number,
      placeholderAlign: String,
      labelWidth: String,
      mask: String,
      shouldToastError: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        firstError: '',
        forceShonbrror: false,
        hasLengthEqual: false,
        valid: true,
        currentValue: '',
        shonbrrorToast: false
      }
    },
    created () {
      this.currentValue = (this.value === undefined || this.value === null) ? '' : (this.mask ? this.maskValue(this.value) : this.value)

      if (this.required && !this.currentValue) {
        this.valid = false
      }
      this.handleChangeEvent = true
      if (this.debounce) {
        this._debounce = Debounce(() => {
          this.$emit('on-change', this.currentValue)
        }, this.debounce)
      }
    },
    beforeDestroy () {
      if (this._debounce) {
        this._debounce.cancel()
      }
    },
    computed: {
      labelStyles () {
        return cleanStyle({
          width: getParentProp(this, 'labelWidth'),
          textAlign: getParentProp(this, 'labelAlign'),
          marginRight: getParentProp(this, 'labelMarginRight')
        })
      },
      labelClass () {
        return {
          'vux-cell-justify':  getParentProp(this, 'justify') === 'justify'
        }
      },
      pattern () {
        if (this.keyboard === 'number' || this.isType === 'china-mobile') {
          return '[0-9]*'
        }
      },
      inputStyle () {
        if (this.textAlign) {
          return {
            textAlign: this.textAlign
          }
        }
      },
      showWarn () {
        return !this.novalidate && !this.equalWith && !this.valid && this.firstError && (this.touched || this.forceShonbrror)
      }
    },
    methods: {
      maskValue (val) {
        const val1 = this.mask ? mask.toPattern(val, this.mask) : val
        return val1
      },
      reset (value = '') {
        this.dirty = false
        this.currentValue = value
        this.firstError = ''
        this.valid = true
      },
      clear () {
        this.currentValue = ''
        this.focus()
      },
      focus () {
        this.$refs.input.focus()
      },
      blur () {
        this.$refs.input.blur()
      },
      focusHandler ($event) {
        this.$emit('on-focus', this.currentValue, $event)
      },
      onBlur ($event) {
        this.setTouched()
        this.validate()
        this.$emit('on-blur', this.currentValue, $event)
      },
      onKeyUp (e) {
        if (e.key === 'Enter') {
          e.target.blur()
          this.$emit('on-enter', this.currentValue, e)
        }
      },
      validate () {
        if (typeof this.equalWith !== 'undefined') {
          this.validateEqual()
          return
        }
        this.errors = {}

        if (!this.currentValue && !this.required) {
          this.valid = true
          return
        }

        if (!this.currentValue && this.required) {
          this.valid = false
          this.errors.required = '必填哦'
          this.getError()
          return
        }

        if (typeof this.isType === 'string') {
          const validator = validators[this.isType]
          if (validator) {
            let value = this.currentValue

            if (this.isType === 'china-mobile' && this.mask === '999 9999 9999') {
              value = this.currentValue.replace(/\s+/g, '')
            }

            this.valid = validator[ 'fn' ](value)
            if (!this.valid) {
              this.forceShonbrror = true
              this.errors.format = validator[ 'msg' ] + '格式不对哦~'
              this.getError()
              return
            } else {
              delete this.errors.format
            }
          }
        }

        if (typeof this.isType === 'function') {
          const validStatus = this.isType(this.currentValue)
          this.valid = validStatus.valid
          if (!this.valid) {
            this.errors.format = validStatus.msg
            this.forceShonbrror = true
            if (!this.firstError) {
              this.getError()
            }
            return
          } else {
            delete this.errors.format
          }
        }

        if (this.min) {
          if (this.currentValue.length < this.min) {
            this.errors.min = `最少应该输入${this.min}个字符哦`
            this.valid = false
            if (!this.firstError) {
              this.getError()
            }
            return
          } else {
            delete this.errors.min
          }
        }

        if (this.max) {
          if (this.currentValue.length > this.max) {
            this.errors.max = `最多可以输入${this.max}个字符哦`
            this.valid = false
            this.forceShonbrror = true
            return
          } else {
            this.forceShonbrror = false
            delete this.errors.max
          }
        }

        this.valid = true
      },
      validateEqual () {
        if (!this.equalWith && this.currentValue) {
          this.valid = false
          this.errors.equal = '输入不一致'
          return
        }
        let willCheck = this.dirty || this.currentValue.length >= this.equalWith.length
        // 只在长度符合时显示正确与否
        if (willCheck && this.currentValue !== this.equalWith) {
          this.valid = false
          this.errors.equal = '输入不一致'
          return
        } else {
          if (!this.currentValue && this.required) {
            this.valid = false
          } else {
            this.valid = true
            delete this.errors.equal
          }
        }
      }
    },
    watch: {
      mask (val) {
        if (val && this.currentValue) {
          this.currentValue = this.maskValue(this.currentValue)
        }
      },
      valid () {
      this.getError()
      },
      value (val) {
        this.currentValue = val
      },
      equalWith (newVal) {
        if (newVal && this.equalWith) {
          if (newVal.length === this.equalWith.length) {
            this.hasLengthEqual = true
          }
          this.validateEqual()
        } else {
          this.validate()
        }
      },
      currentValue (newVal) {
        if (!this.equalWith && newVal) {
          this.validateEqual()
        }
        if (newVal && this.equalWith) {
          if (newVal.length === this.equalWith.length) {
            this.hasLengthEqual = true
          }
          this.validateEqual()
        } else {
          this.validate()
        }
        this.$emit('input', this.maskValue(newVal))
        if (this._debounce) {
          this._debounce()
        } else {
          this.$emit('on-change', newVal)
        }
      }
    }
  }
</script>

<style lang='less'>
  @import '../../style/nbui/widget/nbui_cell/nbui_access';
  @import '../../style/nbui/widget/nbui_cell/nbui_cell_global';
  @import '../../style/nbui/widget/nbui_cell/nbui_form/nbui_form_common';
  @import '../../style/nbui/widget/nbui_cell/nbui_form/nbui_vcode';

  .vux-x-input .vux-x-input-placeholder-right input::-nbbkit-input-placeholder {
    text-align: right;
  }
  .vux-x-input .vux-x-input-placeholder-center input::-nbbkit-input-placeholder {
    text-align: center;
  }
  .vux-x-input .vux-input-icon {
    font-size: 21px;
  }
  .vux-input-icon.nbui-icon-warn:before, .vux-input-icon.nbui-icon-success:before {
    font-size: 21px;
  }
  .vux-x-input .nbui-icon {
    padding-left: 5px;
  }
  .vux-x-input.nbui-cell_vcode {
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
  }
</style>
