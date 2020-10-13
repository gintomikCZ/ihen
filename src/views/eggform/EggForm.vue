<template>
  <form @submit="onSubmit">
    <div class="container flex-centered">
      <t-datepicker
        :value="day"
        align="right"
        :label="dayLabel"
        :error="dayError"
        format-display="D. MMMMM YYYY"
        :error-message="dayErrorMessage"
        @input="onInputDay"
        @focus="onFocus('day')"
        @blur="onBlur('day')"
      />
    </div>
    <div class="container flex-centered">
      <t-input
        v-model="weight"
        align="right"
        :label="weightLabel"
        :error="weightError"
        inputmode="numeric"
        numeric-only
        :force-focus="forceFocus"
        :error-message="weightErrorMessage"
        @focus="onFocus('weight')"
        @blur="onBlur('weight')"
      />
    </div>
    <div class="container flex-centered egg-form-buttons">
      <t-btn
        color="primary"
        :options="submitButton"
        class="button-gap"
      />
      <t-btn
        color="primary"
        :options="nextButton"
        @click="onNextClick"
      />
    </div>
  </form>
</template>
<script>
export default {
  name: 'EggForm',
  props: {

  },
  data () {
    return {
      dayLabel: 'datum',
      weightLabel: 'váha (g)',
      forceFocus: false,
      submitButton: {
        type: 'submit',
        label: 'uložit'
      },
      nextButton: {
        label: 'uložit a další'
      }
    }
  },
  computed: {
    weightError () {
      return this.$store.getters['eggForm/getControlError']('weight')
    },
    dayError () {
      return this.$store.getters['eggForm/getControlError']('day')
    },
    weightErrorMessage () {
      return this.$store.getters['eggForm/getControlErrorMessage']('weight')
    },
    dayErrorMessage () {
      return this.$store.getters['eggForm/getControlErrorMessage']('day')
    },
    weightDisplay () {
      return this.weight === null || this.weight === undefined ? '' : this.weight
    },
    weight: {
      set (nv) {
        this.$store.commit('eggForm/setControlValue', { control: 'weight', value: nv })
      },
      get () {
        return this.$store.getters['eggForm/getControlValue']('weight')
      }
    },
    day: {
      set (nv) {
        this.$store.commit('eggForm/setControlValue', { control: 'day', value: nv })
      },
      get () {
        return this.$store.getters['eggForm/getControlValue']('day')
      }
    }
  },
  methods: {
    onInputDay (val) {
      this.day = val
    },
    onSubmit (e) {
      e.preventDefault()
      const day = this.day
      return this.$store.dispatch('eggForm/onSubmit').then(() => {
        this.$emit('close-form', day)
      })
    },
    onFocus (control) {
      if (control === 'weight') {
        this.forceFocus = false
      }
      return this.$store.dispatch('eggForm/onControlFocus', control)
    },
    onBlur (control) {
      return this.$store.dispatch('eggForm/validateControl', control)
    },
    onNextClick () {
      const day = this.day
      return this.$store.dispatch('eggForm/onSubmit').then(() => {
        this.day = day
        this.weight = ''
        this.forceFocus = true
      })
    }
  }
}
</script>
<style lang="stylus">
.button-gap
  margin: 0 1rem

.egg-form-buttons 
  margin-top: 3rem

</style>
