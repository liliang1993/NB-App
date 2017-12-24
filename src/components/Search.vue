<template>
  <div class="nbui-search-box" :class="{'nbui-search-fixed':isFixed}" :style="{top: isFixed ? top : '', position: fixPosition }">>
    <div class="nbui-search-bar" :class="{'nbui-search-bar_focusing': !isCancel || currentValue}">
      <slot name="left"></slot>
      <form class="nbui-search-bar__form" @submit.prevent="$emit('on-submit', value)" action=".">
          <div class="nbui-search-mask" @click="touch" v-show="!isFixed && autoFixed"></div>
          <div class="nbui-search-bar__box">
            <i class="nbui-icon-search"></i>
            <input type="search" class="nbui-search-bar__input" :id="`search_input_${uuid}`" :placeholder="placeholder" autocomplete="off" :required="required" v-model="currentValue" ref="input"
            @focus="onFocus"
            @blur="onBlur"/>
            <a href="javascript:" class="nbui-icon-clear" @click="clear" v-show="currentValue"></a>
          </div>
          <label :for="`search_input_${uuid}`" class="nbui-search-bar__label" v-show="!isFocus && !value">
            <i class="nbui-icon-search"></i>
            <span>{{'搜索'}}</span>
          </label>
      </form>
       <a href="javascript:" class="nbui-search-bar__cancel-btn" @click="cancel">{{cancelText || $t('cancel_text')}}</a>
       <slot name="right"></slot>
    </div>
    <div class="nbui-cells nbui-search_show" v-show="isFixed">
      <slot></slot>
      <div class="nbui-cell nbui-cell_access" v-for="item in results" @click="handleResultClick(item)">
        <div class="nbui-cell__bd weui-cell_primary">
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import uuidMixin from '../mixins/uuid'
  export default{
      name:'search',
      minxins:[uuidMixin],
      props: {
        required: {
          type: Boolean,
          default: false
        },
        placeholder: String,
        cancelText: String,
        value: {
          type: String,
          default: ''
        },
        results: {
          type: Array,
          default () {
            return []
          }
        },
        autoFixed: {
          type: Boolean,
          default: true
        },
        top: {
          type: String,
          default: '0px'
        },
        position: {
          type: String,
          default: 'fixed'
        },
        autoScrollToTop: Boolean
      },
      created () {
        if (this.value) {
          this.currentValue = this.value
        }
      },
      computed: {
        fixPosition () {
          if (this.isFixed) {
            return this.position === 'absolute' ? 'absolute' : 'fixed'
          }
          return 'static'
        }
      },
      methods: {
        clear () {
          this.currentValue = ''
          this.isFocus = true
          this.setFocus()
          if (this.autoFixed && !this.isFixed) {
            this.isFixed = true
          }
        },
        cancel () {
          this.isCancel = true
          this.currentValue = ''
          this.isFixed = false
          this.$emit('on-cancel')
        },
        handleResultClick (item) {
          this.$emit('result-click', item) // just for compatibility
          this.$emit('on-result-click', item)
          this.isCancel = true
          this.isFixed = false
        },
        touch () {
          this.isCancel = false
          if (this.autoFixed) {
            this.isFixed = true
          }
          this.$emit('on-touch')
        },
        setFocus () {
          this.$refs.input.focus()
        },
        setBlur () {
          this.$refs.input.blur()
          this.$emit('on-blur')
        },
        onFocus () {
          this.isFocus = true
          this.$emit('on-focus')
          this.touch()
        },
        onBlur () {
          this.isFocus = false
        }
      },
      data () {
        return {
          currentValue: '',
          isCancel: true,
          isFocus: false,
          isFixed: false
        }
      },
      watch: {
        isFixed (val) {
          if (val === true) {
            this.setFocus()
            this.isFocus = true

            if (this.autoScrollToTop) {
              setTimeout(() => {
                window.scrollTo(0, 0)
              }, 150)
            }
          } else {}
        },
        value (val) {
          this.currentValue = val
        },
        currentValue (val) {
          this.$emit('input', val)
          this.$emit('on-change', val)
        }
      }
  }
</script>

<style lang='less'>

</style>
