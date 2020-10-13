<template>
  <div
    class="input-group"
    :class="{ 'invalid': error }"
  >
    <label :for="inputId">{{ label }}</label>
    <input
      autocomplete="off"
      :inputmode="inputmode"
      type="text"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      ref="myInput"
      :value="value"
      :style="{ textAlign: align }"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    >
    <transition name="tslide-left">
      <div
        v-if="error"
        class="error-message"
      >
        {{ errorMessage }}
      </div>
      <div
        v-else-if="!!helper && focus"
        class="helper-text"
      >
        {{ helper }}
      </div>
    </transition>
  </div>
</template>
<script>
import { getUniqueId } from '@/helpers/helper.js'
export default {
  name: 'TInput',
  props: {
    align: { type: String, default: 'left' },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    forceFocus: { type: Boolean, default: false },
    helper: { type: String, default: '' },
    numericOnly: { type: Boolean, default: false },
    inputmode: { type: String, default: 'date' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    value: { validator: (v) => typeof v === 'string' || v === null, required: true }
  },
  watch: {
    forceFocus (nv) {
      if (nv) {
        this.$refs.myInput.focus()
      }
    }
  },
  data () {
    return {
      inputId: '',
    }
  },
  mounted () {
    this.inputId = getUniqueId()
    this.$nextTick(() => {
      this.$refs.myInput.setAttribute('id', this.inputId)
      this.$emit('input-id-set', this.inputId)
    })
    if (this.autofocus) this.$refs.myInput.focus()
  },
  methods: {
    onInput (e) {
      if (e.target.value === null) {
        this.$emit('input', '')
        return
      }
      if (this.numericOnly) {
        e.target.value = e.target.value.replace(/\D/g, '')
      }
      this.$emit('input', e.target.value)
    },
    onFocus (e) {
      this.$emit('focus', e)
    },
    onBlur (e) {
      this.$emit('blur', e)
    }
  }
}
</script>
<style lang="stylus">
.input-group
  display: inline-flex
  flex-direction: column
  position: relative

.input-group > input
  background: #fff
  border-radius: var(--border-radius)
  border: 2px solid var(--border)
  color: var(--text-color)
  cursor: text
  font-size: 1.8rem
  line-height: 1.4
  margin: 0.5rem
  padding: var(--input-padding)
  transition: all 0.3s ease-in-out

.input-group > input:disabled 
  background: #cdcdcd
  font-style: italic
  cursor: not-allowed

.input-group > input[readonly]
  cursor: default

.input-group > input:not(:disabled):not([readonly]):hover:not(:focus)
  border-color: var(--text-color-dark)
.input-group.invalid > input
  border-color: var(--primary600)

.input-group > input:focus
  box-shadow: var(--focus-shadow)
  outline: none
  border-color: transparent

.input-group > input:placeholder 
  font-size: 1.6rem
  color: text-color-light

.input-group > label
  margin-left: 0.5rem
  color: var(--text-color)
  font-weight: 600
  font-size: 1.6rem
  line-height: 1.3

.error-message
  color: var(--primary600)

.error-message, .helper-text
  font-size: 1.3rem
  font-style: italic
  font-weight: 500
  padding: 0 0.5rem
  position: absolute
  top: 100%

.helper-text
  color: var(--text-color-light)

</style>
