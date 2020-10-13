<template>
  <transition name="tslide-down">
    <div
      v-if="show"
      class="egg-edit-popover"
    >
      <div class="egg-edit-popover-message">
        {{ 'úprava vejce č. ' + eggNumber }}
      </div>
      <div class="egg-edit-popover-field">
        <t-input
          v-model="value"
          align="right"
          label="váha (g)"
          inputmode="numeric"
          numeric-only
          :error="error"
          :error-message="errorMessage"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
      <div class="egg-edit-popover-buttons">
        <t-btn
          color="primary"
          :options="buttonEdit"
          @click="onEditButtonClick"
        />
        <t-btn
          color="secondary"
          :options="buttonCancel"
          @click="$emit('cancel')"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import validator from '@/helpers/validator.js'
export default {
  name: 'EggEditWeight',
  props: {
    show: { type: Boolean, default: false },
    eggNumber: { type: Number, required: true },
    eggId: { validator: (v) => {
      return v === null || (typeof v === 'string') || (typeof v === 'number') }, required: true
    }
  },
  data () {
    return {
      value: '',
      error: false,
      errorMessage: '',
      buttonEdit: {
        label: 'uložit'
      },
      buttonCancel: {
        label: 'zpět'
      }
    }
  },
  computed: {
    rules () {
      return this.$store.getters['eggForm/getControlValidationRules']('weight')
    },
    egg () {
      if (!this.eggId) return null
      return this.$store.getters['eggs/getEgg']('' + this.eggId)
    },
    weight () {
      return !this.egg ? null : this.egg.weight
    }
  },
  watch: {
    weight (nv) {
      if (nv !== null) {
        this.value = '' + nv
      }
    }
  },
  methods: {
    onEditButtonClick () {
      this.validate()
      if (!this.error) {
        this.$emit('edit', this.value)
      }
    },
    validate () {
      const keys = Object.keys(this.rules)
      const len = keys.length
      let valid = true
      let message = ''
      for (let i = 0; i < len; i += 1) {
        if (valid) {
          const result = ('param' in this.rules[keys[i]])
            ? validator[keys[i]](this.value, this.rules[keys[i]].param)
            : validator[keys[i]](this.value)
          if (!result) {
            valid = false
            message = this.rules[keys[i]].message
          }
        }
      }
      this.error = !valid
      this.errorMessage = message
    },
    onBlur () {
      this.validate()
    },
    onFocus () {
      this.error = false
      this.errorMessage = ''
    }
  }
}
</script>
