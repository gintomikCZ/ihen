<template>
  <button
    :type="buttonType"
    :class="['t-btn', 't-btn-' + color, 't-btn-' + size]"
    @click="onClick"
  >
    <slot />
  </button>
</template>
<script>
export default {
  name: 'TBtnWrapButton',
  props: {
    buttonType: { type: String, default: 'button' },
    color: { type: String, required: true },
    size: { type: String, required: true }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
