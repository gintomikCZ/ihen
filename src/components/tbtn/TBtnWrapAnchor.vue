<template>
  <a
    :href="href"
    :class="['t-btn', 't-btn-' + color, 't-btn-' + size]"
  >
    <slot />
  </a>
</template>
<script>
export default {
  name: 'TBtnWrapAnchor',
  props: {
    href: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true }
  }
}
</script>
