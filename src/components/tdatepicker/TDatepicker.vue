<template>
  <div>
    <t-input
      :align="align"
      :autofocus="autofocus"
      :disabled="disabled"
      :error-message="errorMessage"
      :error="error"
      :helper="helper"
      :input-id="inputId"
      :label="label"
      inputmode="decimal"
      :placeholder="formatInput"
      :readonly="readonly"
      :value="inputValue"
      @input-id-set="onInputIdSet"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <t-datepicker-body
      :show-picker="showPicker"
      :show-month-picker="showMonthPicker"
      :show-year-picker="showYearPicker"
      :date="datepickerBodyValue"
      :input-id="inputId"
      @close-me="showPicker = false"
      @show-months="showMonthPicker = true"
      @close-months="showMonthPicker = false"
      @close-years="showYearPicker=false"
      @show-years="showYearPicker=true"
      @day-picked="onDayPicked"
    />
  </div>
</template>
<script>
import { isNumeric, setCaretPosition } from '@/helpers/helper.js'
import dh from '@/helpers/dateHelper.js'
import TDatepickerBody from './TDatepickerBody.vue'
export default {
  name: 'TDatepicker',
  props: {
    align: { type: String, default: 'left' },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    formatDb: { type: String, default: 'YYYY-MM-DD' },
    formatDisplay: { type: String, default: 'D. MMMM YYYY' },
    helper: { type: String, default: '' },
    label: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    value: { validator: (v) => (typeof v === 'string' || v === null), required: true }
  },
  computed: {
    inputValue () {
      return this.showPicker ? this.typedValue : this.displayValue
    },
    displayValue () {
      return this.value === null ? '' : dh.formatDate(this.value, this.formatDb, this.formatDisplay)
    },
    datepickerBodyValue () {
      const dt = new Date(this.value)
      return dh.isValidDate(dt) ? dt : new Date()
    }

  },
  mounted () {
    this.$nextTick(() => {
      this.inputEl = document.getElementById(this.inputId)
      this.inputEl.addEventListener('keydown', this.onKeydown)
    })
  },
  beforeDestroy () {
    this.inputEl.removeEventListener('keydown', this.onKeydown)
  },
  data () {
    return {
      typedValue: '',
      formatInput: 'DD.MM.YYYY',
      inputId: '',
      showPicker: false,
      lastKeyCode: null,
      inputEl: null,
      selectionStart: 0,
      oldValue: '',
      showMonthPicker: false,
      showYearPicker: false
    }
  },
  watch: {
    value (nv) {
      if (this.showPicker) {
        this.typedValue = dh.isValidDate(nv, this.formatDb) ? dh.formatDate(nv, this.formatDb, this.formatInput) : ''
      }
    },
    showPicker (nv) {
      this.$emit(nv ? 'focus' : 'blur')
    }
  },
  methods: {
    onInputIdSet (val) {
      this.inputId = val
    },
    onClearableClick () {
      this.$emit('input', '')
    },
    onFocus () {
      this.showPicker = true
      this.typedValue = dh.isValidDate(this.value, this.formatDb) ? dh.formatDate(this.value, this.formatDb, this.formatInput) : ''
      this.oldValue = this.typedValue
      setCaretPosition(this.inputEl)
    },

    onKeydown (e) {
      this.lastKeyCode = e.keyCode
      this.selectionStart = e.target.selectionStart
      if (e.keyCode !== 13) return  
      this.saveTypedValue()
    },
    onInput (val) {
      if (this.lastKeyCode === 8 || this.lastKeyCode === 46) return // backspace, delete
      const len = val.length
      if (this.selectionStart === (len - 1)) {
        if (this.lastKeyCode === 190) { // period
          if (len === 2 && isNumeric(val.substr(0, 1)) && val.substr(1, 1) === '.') val = '0' + val
          else if (len === 5 && isNumeric(val.substr(0, 2)) && val.substr(2, 1) === '.' && isNumeric(val.substr(3, 1)) && val.substr(4, 1) === '.') val = val.substr(0, 3) + '0' + val.substr(3, 2)
        } else {
          // from four to nine
          if (len === 1 && isNumeric(val) && ((this.lastKeyCode <= 57 && this.lastKeyCode >= 52) || (this.lastKeyCode <= 105 && this.lastKeyCode >= 100))) val = '0' + val
          else if (len === 4 && isNumeric(val.substr(0, 2)) && isNumeric(val.substr(3, 1)) && val.substr(2, 1) === '.') {
            // from two to nine
            if ((this.lastKeyCode <= 57 && this.lastKeyCode >= 50) || (this.lastKeyCode <= 105 && this.lastKeyCode >= 98)) val = val.substr(0, 3) + '0' + val.substr(3, 1)
          }
        }
      }
      const unmasked = val.replace(/[^0-9]/g, '')
      if (dh.isValidDatePart(unmasked)) {
        const masked = dh.maskDate(unmasked)
        this.inputEl.value = masked
        this.oldValue = masked
        this.typedValue = masked
        return
      }
      this.inputEl.value = this.oldValue
      this.typedValue = this.oldValue
    },
    onBlur (e) {
      this.saveTypedValue()
      if (!this.$el.contains(e.relatedTarget)) {
        this.showPicker = false
      }
    },
    saveTypedValue () {
      if (!this.typedValue) {
        this.$emit('input', '')
        return
      }
      if (!dh.isValidDate(this.typedValue, this.formatInput)) {
        this.typedValue = ''
        return
      }
      this.$emit('input',  dh.formatDate(this.typedValue, this.formatInput, this.formatDb))
    },
    onDayPicked (dt) {
      this.$emit('input', dh.isValidDate(dt) ? dh.formatDateFromObject(dt, this.formatDb) : '')
      this.showPicker = false
    }
  },
  components: { TDatepickerBody }
}
</script>
