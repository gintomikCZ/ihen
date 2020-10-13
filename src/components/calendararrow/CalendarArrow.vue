<template>
  <t-btn
    :options="options"
    color="secondary"
    @click="onClick"
  />
</template>
<script>
export default {
  name: 'CalendarArrow',
  props: {
    direction: { type: String, default: 'left' },
    double: { type: Boolean, default: false },
    size: { type: String, default: 'medium' }
  },
  computed: {
    icon () {
      let str = 'angle'
      if (this.double) str += 'Double'
      str += this.direction.charAt(0).toUpperCase()
      str += this.direction.substr(1).toLowerCase()
      return str
    },
    options () {
      return {
        size: this.size,
        icon: this.icon
      }
    }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
