<template>
  <div
    class="month-picker-item"
    ref="myInner"
    :class="{ 'month-picker-item-active': isActive }"
    @click="onClick"
  >
    {{ year }}
  </div>
</template>
<script>
export default {
  name: 'YearInYearPicker',
  props: {
    currentYear: { type: Number, required: true },
    year: { type: String, required: true }
  },
  computed: {
    isActive () {
      return (('' + this.year) === ('' + this.currentYear))
    }
  },
  methods: {
    onClick () {
      this.$emit('click', this.year)
    }
  },
  watch: {
    currentYear (nv) {
      this.$nextTick(() => {
        if (this.year === '' + nv) {
          this.$el.removeAttribute('tabindex')
          return
        }
        this.$el.setAttribute('tabindex', '0')
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.year !== '' + this.currentYear) {
        this.$el.setAttribute('tabindex', '0')
      }
    })
  }
}
</script>
 