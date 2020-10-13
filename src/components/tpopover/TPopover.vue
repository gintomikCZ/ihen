<template>
  <transition
    :name="transition"
    @enter="onEnter"
    @leave="onLeave"
    @after-enter="$emit('show')"
    @after-leave="$emit('hide')"
  >
    <div
      v-if="show"
      ref="content"
      :class="popoverClass"
      :style="styleObject"
    >
      <slot />
    </div>
  </transition>
</template>
<script>
import { generateZindex } from '@/helpers/helper'
export default {
  name: 'TPopover',
  props: {
    customCss: { type: Array, default: () => [] },
    horizontalOffset: { type: Number, default: 0 },
    show: { type: Boolean, required: true },
    targetId: { type: String, default: '' },
    transition: { type: String, default: 'tfade' },
    verticalOffset: { type: Number, default: 5 },
    customStyles: { type: Object, default: () => {} }
  },
  created () {
    this.styleObject = Object.assign(this.styleObject, this.customStyles)
  },
  data () {
    return {
      styleObject: {}
    }
  },
  computed: {
    popoverClass () {
      return ['t-popover'].concat(this.customCss)
    }
  },
  methods: {
    onEnter (el) {
      el.style.zIndex = generateZindex()
      // const target = document.getElementById(this.targetId)
      // absolutePosition(el, target, this.verticalOffset, this.horizontalOffset)
      // this.$wrap(el)
      document.addEventListener('click', this.outsideClickHandler, true)
    },
    onLeave () {
      document.removeEventListener('click', this.outsideClickHandler, true)
    },
    outsideClickHandler (e) {
      const el = this.$refs.content
      const target = document.getElementById(this.targetId)
      if (!el || (!el.contains(e.target) && e.target !== target)) {
        e.stopPropagation()
        e.preventDefault()
        this.$emit('close-me')
      }
    }
  }
}
</script>
<style lang="stylus">
.t-popover
  position: absolute
</style>
