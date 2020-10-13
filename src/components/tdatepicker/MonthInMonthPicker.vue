<template>
  <div class="month-picker-item-outer">
    <div
      class="month-picker-item"
      ref="myInner"
      :class="{
        'month-picker-item-active':isActive
      }"
      @click="onClick"
    >
      {{ month.label }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'MonthInMonthPicker',
  props: {
    month: { type: Object, required: true },
    currentMonth: { type: Number, required: true }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.isActive) {
        this.$refs.myInner.setAttribute('tabindex', '0')
      }
    })
  },
  computed: {
    currentMonthString () {
      return '' + this.currentMonth
    },
    isActive () {
      return this.month.value === this.currentMonthString
    }
  },
  methods: {
    onClick () {
      this.$emit('click', this.month)
    }
  }
}
</script>
