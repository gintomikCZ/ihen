<template>
  <div class="t-dtp-hoverable-outer">
    <div
      class="t-dtp-hoverable"
      tabindex="0"
      @click="onClick"
    >
      <icon-base
        :name="icon"
        :size="24"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'TDatepickerArrow',
  props: {
    direction: { type: String, default: 'left' },
    double: { type: Boolean, default: false }
  },
  computed: {
    icon () {
      if (this.double) return this.direction === 'left' ? 'angleDoubleLeft' : 'angleDoubleRight'
      return this.direction === 'left' ? 'angleLeft' : 'angleRight'
    }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
